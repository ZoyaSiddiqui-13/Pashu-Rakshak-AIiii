import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from bson import ObjectId
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from pymongo import AsyncMongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import DuplicateKeyError, PyMongoError
from pwdlib import PasswordHash


load_dotenv()

APP_NAME = "PASHU-RAKSHAK AI API"
MONGO_URI = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "pashu_rakshak_ai")
JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_THIS_SECRET_IN_ENV")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "480"))

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    item.strip()
    for item in frontend_url.split(",")
    if item.strip()
] or ["http://localhost:5173"]

password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

DEMO_USERS = [
    {
        "role": "farmer",
        "name": "Farmer",
        "email": "farmer@pashurakshak.ai",
        "password": "Farmer@123",
    },
    {
        "role": "farm-admin",
        "name": "Farm Admin",
        "email": "farmadmin@pashurakshak.ai",
        "password": "Farm@123",
    },
    {
        "role": "super-admin",
        "name": "Super Admin",
        "email": "superadmin@pashurakshak.ai",
        "password": "Super@123",
    },
    {
        "role": "veterinarian",
        "name": "Veterinarian",
        "email": "vet@pashurakshak.ai",
        "password": "Vet@123",
    },
    {
        "role": "staff",
        "name": "Staff",
        "email": "staff@pashurakshak.ai",
        "password": "Staff@123",
    },
    {
        "role": "field-worker",
        "name": "Field Worker",
        "email": "fieldworker@pashurakshak.ai",
        "password": "Field@123",
    },
    {
        "role": "lab-staff",
        "name": "Lab Staff",
        "email": "labstaff@pashurakshak.ai",
        "password": "Lab@123",
    },
    {
        "role": "district-admin",
        "name": "District Admin",
        "email": "districtadmin@pashurakshak.ai",
        "password": "District@123",
    },
    {
        "role": "state-admin",
        "name": "State Admin",
        "email": "stateadmin@pashurakshak.ai",
        "password": "State@123",
    },
]


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str
    mobile: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=8, max_length=128)


class HealthRecordCreate(BaseModel):
    animal_id: str
    record_type: str
    title: str
    notes: str | None = None
    date: str | None = None


class VaccinationCreate(BaseModel):
    animal_id: str
    vaccine: str
    date: str
    next_due_date: str | None = None
    status: str = "Scheduled"


class TreatmentCreate(BaseModel):
    animal_id: str
    case_id: str | None = None
    medicine: str
    dosage: str | None = None
    start_date: str
    end_date: str | None = None
    status: str = "Active"
    notes: str | None = None


class LabTestCreate(BaseModel):
    case_id: str | None = None
    animal_id: str | None = None
    animal_name: str
    sample_type: str = "Blood"
    test_name: str
    priority: str = "Medium"
    status: str = "Pending"
    notes: str | None = None
    collected_by: str | None = None
    collected_at: str | None = None
    result: str | None = None
    report_url: str | None = None


class LabTestUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    notes: str | None = None
    result: str | None = None
    report_url: str | None = None
    collected_by: str | None = None
    collected_at: str | None = None


class FollowUpCreate(BaseModel):
    case_id: str | None = None
    animal_id: str | None = None
    animal_name: str
    scheduled_date: str
    purpose: str = "Health follow-up"
    assigned_to: str | None = None
    notes: str | None = None
    status: str = "Scheduled"


class FollowUpUpdate(BaseModel):
    scheduled_date: str | None = None
    purpose: str | None = None
    assigned_to: str | None = None
    notes: str | None = None
    status: str | None = None


class AIAnalysisRequest(BaseModel):
    animal_id: str | None = None
    symptoms: list[str] = []
    observations: str | None = None
    temperature_c: float | None = None


class AnimalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    species: str = Field(min_length=1, max_length=80)
    breed: str | None = None
    age: int | None = Field(default=None, ge=0, le=50)
    gender: str | None = None
    village: str | None = None
    health_status: str = "Healthy"


class AnimalUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    breed: str | None = None
    age: int | None = Field(default=None, ge=0, le=50)
    gender: str | None = None
    village: str | None = None
    health_status: str | None = None


class CaseCreate(BaseModel):
    animal_id: str | None = None
    animal_name: str
    owner_name: str | None = None
    village: str | None = None
    condition: str
    risk: str = "Medium"
    symptoms: list[str] = []
    observations: str | None = None
    stage: str = "reported"


class CaseUpdate(BaseModel):
    status: str | None = None
    stage: str | None = None
    risk: str | None = None
    assigned_to: str | None = None
    notes: str | None = None
    escalated: bool | None = None
    lab_result: str | None = None
    treatment: str | None = None
    follow_up_date: str | None = None


class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str = "info"
    target_role: str | None = None
    case_id: str | None = None


app = FastAPI(
    title=APP_NAME,
    version="1.0.0",
    description="Backend API for PASHU-RAKSHAK AI livestock health surveillance.",
)


@asynccontextmanager
async def lifespan(application: FastAPI):
    client = AsyncMongoClient(MONGO_URI, server_api=ServerApi("1"))
    application.state.mongo_client = client
    application.state.db = client[DB_NAME]

    try:
        await client.admin.command("ping")
        await ensure_indexes(application.state.db)
        await seed_demo_users(application.state.db)
    except Exception as exc:
        print(f"[DB WARNING] MongoDB is not ready: {exc}")

    yield

    await client.close()


app.router.lifespan_context = lifespan


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def ensure_indexes(db):
    await db.users.create_index("email", unique=True)
    await db.animals.create_index([("owner_user_id", 1), ("created_at", -1)])
    await db.cases.create_index([("created_by", 1), ("created_at", -1)])
    await db.cases.create_index([("risk", 1), ("stage", 1)])
    await db.notifications.create_index([("created_at", -1)])
    await db.health_records.create_index([("created_by", 1), ("created_at", -1)])
    await db.vaccinations.create_index([("created_by", 1), ("date", -1)])
    await db.treatments.create_index([("created_by", 1), ("created_at", -1)])
    await db.lab_tests.create_index([("case_id", 1), ("created_at", -1)])
    await db.ai_analyses.create_index([("animal_id", 1), ("created_at", -1)])
    await db.follow_ups.create_index([("created_by", 1), ("scheduled_date", 1)])


async def seed_demo_users(db):
    for item in DEMO_USERS:
        existing = await db.users.find_one({"email": item["email"].lower()})
        if existing:
            continue

        doc = {
            "name": item["name"],
            "email": item["email"].lower(),
            "password_hash": password_hash.hash(item["password"]),
            "role": item["role"],
            "active": True,
            "created_at": datetime.now(timezone.utc),
        }

        try:
            await db.users.insert_one(doc)
        except DuplicateKeyError:
            pass


def get_db():
    return app.state.db


def serialize_id(document: dict[str, Any] | None):
    if document is None:
        return None
    result = dict(document)
    result["id"] = str(result.pop("_id"))
    return result


def create_access_token(user: dict[str, Any]) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "name": user["name"],
        "exp": expire,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db),
):
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token subject.")

    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user identifier.")

    user = await db.users.find_one({"_id": oid, "active": True})

    if not user:
        raise HTTPException(status_code=401, detail="User no longer active.")

    return user


def require_roles(*roles: str):
    async def dependency(user=Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission for this resource.",
            )
        return user

    return dependency


@app.get("/")
async def root():
    return {
        "name": APP_NAME,
        "status": "running",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
async def health(db=Depends(get_db)):
    try:
        await db.command("ping")
        return {
            "status": "ok",
            "database": "connected",
            "service": APP_NAME,
            "time": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as exc:
        return {
            "status": "degraded",
            "database": "disconnected",
            "service": APP_NAME,
            "error": str(exc),
        }


async def authenticate(email: str, password: str, db):
    user = await db.users.find_one(
        {"email": email.strip().lower(), "active": True}
    )

    if not user or not password_hash.verify(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def auth_response(user):
    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }


@app.post("/api/auth/login")
async def login(payload: LoginRequest, db=Depends(get_db)):
    user = await authenticate(payload.email, payload.password, db)
    return auth_response(user)


@app.post("/api/auth/register", status_code=201)
async def register(payload: RegisterRequest, db=Depends(get_db)):
    email = payload.email.strip().lower()

    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    document = {
        "name": payload.name.strip(),
        "email": email,
        "mobile": payload.mobile.strip(),
        "password_hash": password_hash.hash(payload.password),
        "role": "farmer",
        "active": True,
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = await db.users.insert_one(document)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    created = await db.users.find_one({"_id": result.inserted_id})
    return auth_response(created)


@app.post("/api/auth/token")
async def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db),
):
    user = await authenticate(form_data.username, form_data.password, db)
    return auth_response(user)


@app.get("/api/auth/me")
async def me(user=Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }


@app.get("/api/dashboard/summary")
async def dashboard_summary(user=Depends(get_current_user), db=Depends(get_db)):
    role = user["role"]

    if role in {"super-admin", "state-admin", "district-admin"}:
        animal_count = await db.animals.count_documents({})
        case_count = await db.cases.count_documents({})
        critical_count = await db.cases.count_documents(
            {"risk": "Critical", "stage": {"$ne": "resolved"}}
        )
    else:
        animal_count = await db.animals.count_documents(
            {"owner_user_id": str(user["_id"])}
        )
        case_count = await db.cases.count_documents(
            {"created_by": str(user["_id"])}
        )
        critical_count = await db.cases.count_documents(
            {"created_by": str(user["_id"]), "risk": "Critical"}
        )

    active_cases = await db.cases.count_documents(
        {"stage": {"$ne": "resolved"}}
    )

    return {
        "animals": animal_count,
        "cases": case_count,
        "critical_cases": critical_count,
        "active_cases": active_cases,
        "role": role,
    }


@app.get("/api/animals")
async def list_animals(
    user=Depends(get_current_user),
    db=Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    query = {}

    if user["role"] in {"farmer", "farm-admin", "staff"}:
        query["owner_user_id"] = str(user["_id"])

    cursor = db.animals.find(query).sort("created_at", -1).skip(skip).limit(limit)
    items = [serialize_id(item) async for item in cursor]
    return {"items": items, "count": len(items)}


@app.post("/api/animals", status_code=201)
async def create_animal(
    payload: AnimalCreate,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    document = payload.model_dump()
    document.update(
        {
            "owner_user_id": str(user["_id"]),
            "created_by": str(user["_id"]),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
    )

    result = await db.animals.insert_one(document)
    created = await db.animals.find_one({"_id": result.inserted_id})
    return serialize_id(created)


@app.patch("/api/animals/{animal_id}")
async def update_animal(
    animal_id: str,
    payload: AnimalUpdate,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    try:
        oid = ObjectId(animal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid animal id.")

    animal = await db.animals.find_one({"_id": oid})

    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found.")

    if (
        user["role"] in {"farmer", "farm-admin", "staff"}
        and animal.get("owner_user_id") != str(user["_id"])
    ):
        raise HTTPException(status_code=403, detail="Access denied.")

    updates = {
        key: value
        for key, value in payload.model_dump().items()
        if value is not None
    }
    updates["updated_at"] = datetime.now(timezone.utc)

    await db.animals.update_one({"_id": oid}, {"$set": updates})
    updated = await db.animals.find_one({"_id": oid})
    return serialize_id(updated)


@app.get("/api/cases")
async def list_cases(
    user=Depends(get_current_user),
    db=Depends(get_db),
    risk: str | None = None,
    stage: str | None = None,
    limit: int = Query(100, ge=1, le=200),
):
    query = {}

    if risk:
        query["risk"] = risk

    if stage:
        query["stage"] = stage

    if user["role"] in {"farmer", "farm-admin"}:
        query["created_by"] = str(user["_id"])

    cursor = db.cases.find(query).sort("created_at", -1).limit(limit)
    items = [serialize_id(item) async for item in cursor]
    return {"items": items, "count": len(items)}


@app.post("/api/cases", status_code=201)
async def create_case(
    payload: CaseCreate,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    document = payload.model_dump()
    document.update(
        {
            "created_by": str(user["_id"]),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "status": "Open",
            "escalated": False,
        }
    )

    result = await db.cases.insert_one(document)
    created = await db.cases.find_one({"_id": result.inserted_id})

    case_id = str(result.inserted_id)

    await db.notifications.insert_one(
        {
            "title": "New animal health case",
            "message": f"{payload.animal_name} has been reported for {payload.condition}.",
            "notification_type": "case",
            "target_role": "veterinarian",
            "case_id": case_id,
            "created_at": datetime.now(timezone.utc),
            "read": False,
        }
    )

    return serialize_id(created)


@app.patch("/api/cases/{case_id}")
async def update_case(
    case_id: str,
    payload: CaseUpdate,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    try:
        oid = ObjectId(case_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case id.")

    case = await db.cases.find_one({"_id": oid})

    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    allowed_roles = {
        "farmer",
        "farm-admin",
        "veterinarian",
        "field-worker",
        "lab-staff",
        "staff",
        "district-admin",
        "state-admin",
        "super-admin",
    }

    if user["role"] not in allowed_roles:
        raise HTTPException(status_code=403, detail="Access denied.")

    updates = {
        key: value
        for key, value in payload.model_dump().items()
        if value is not None
    }

    if payload.escalated is True:
        updates["stage"] = "escalated"

    updates["updated_at"] = datetime.now(timezone.utc)

    await db.cases.update_one({"_id": oid}, {"$set": updates})
    updated = await db.cases.find_one({"_id": oid})

    if payload.escalated is True:
        await db.notifications.insert_one(
            {
                "title": "Case escalated",
                "message": f"Case {case_id} requires government-level review.",
                "notification_type": "escalation",
                "target_role": "district-admin",
                "case_id": case_id,
                "created_at": datetime.now(timezone.utc),
                "read": False,
            }
        )

    return serialize_id(updated)


def scoped_query(user, key="created_by"):
    return {key: str(user["_id"])}


@app.get("/api/health-records")
async def list_health_records(user=Depends(get_current_user), db=Depends(get_db)):
    query = {} if user["role"] in {"veterinarian", "lab-staff", "district-admin", "state-admin", "super-admin"} else scoped_query(user)
    cursor = db.health_records.find(query).sort("created_at", -1).limit(200)
    return {"items": [serialize_id(item) async for item in cursor]}


@app.post("/api/health-records", status_code=201)
async def create_health_record(
    payload: HealthRecordCreate,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    document = payload.model_dump()
    document.update(
        {
            "created_by": str(user["_id"]),
            "created_at": datetime.now(timezone.utc),
        }
    )
    result = await db.health_records.insert_one(document)
    return serialize_id(await db.health_records.find_one({"_id": result.inserted_id}))


@app.get("/api/health-records")
async def list_health_records(user=Depends(get_current_user), db=Depends(get_db)):
    query = {} if user["role"] in {"veterinarian", "lab-staff", "field-worker", "district-admin", "state-admin", "super-admin"} else {"created_by": str(user["_id"])}
    cursor = db.health_records.find(query).sort("created_at", -1).limit(200)
    return {"items": [serialize_id(item) async for item in cursor]}


@app.post("/api/health-records", status_code=201)
async def create_health_record(payload: HealthRecordCreate, user=Depends(get_current_user), db=Depends(get_db)):
    document = payload.model_dump()
    now = datetime.now(timezone.utc)
    document.update({"created_by": str(user["_id"]), "created_at": now})
    result = await db.health_records.insert_one(document)
    return serialize_id(await db.health_records.find_one({"_id": result.inserted_id}))


@app.get("/api/vaccinations")
async def list_vaccinations(user=Depends(get_current_user), db=Depends(get_db)):
    query = {} if user["role"] in {"veterinarian", "field-worker", "district-admin", "state-admin", "super-admin"} else {"created_by": str(user["_id"])}
    cursor = db.vaccinations.find(query).sort("date", -1).limit(250)
    return {"items": [serialize_id(item) async for item in cursor]}


@app.post("/api/vaccinations", status_code=201)
async def create_vaccination(payload: VaccinationCreate, user=Depends(get_current_user), db=Depends(get_db)):
    document = payload.model_dump()
    now = datetime.now(timezone.utc)
    document.update({"created_by": str(user["_id"]), "created_at": now})
    result = await db.vaccinations.insert_one(document)
    return serialize_id(await db.vaccinations.find_one({"_id": result.inserted_id}))


@app.patch("/api/vaccinations/{vaccination_id}")
async def update_vaccination(vaccination_id: str, payload: dict[str, Any], user=Depends(require_roles("farmer", "farm-admin", "veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    try:
        oid = ObjectId(vaccination_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vaccination id.")
    existing = await db.vaccinations.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Vaccination not found.")
    updates = {k:v for k,v in payload.items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)
    await db.vaccinations.update_one({"_id": oid}, {"$set": updates})
    return serialize_id(await db.vaccinations.find_one({"_id": oid}))


@app.get("/api/treatments")
async def list_treatments(user=Depends(get_current_user), db=Depends(get_db)):
    query = {} if user["role"] in {"veterinarian", "field-worker", "lab-staff", "district-admin", "state-admin", "super-admin"} else {"created_by": str(user["_id"])}
    cursor = db.treatments.find(query).sort("created_at", -1).limit(250)
    return {"items": [serialize_id(item) async for item in cursor]}


@app.post("/api/treatments", status_code=201)
async def create_treatment(payload: TreatmentCreate, user=Depends(require_roles("veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    document = payload.model_dump()
    now = datetime.now(timezone.utc)
    document.update({"created_by": str(user["_id"]), "created_at": now, "updated_at": now})
    result = await db.treatments.insert_one(document)
    treatment = await db.treatments.find_one({"_id": result.inserted_id})

    if payload.case_id:
        try:
            await db.cases.update_one({"_id": ObjectId(payload.case_id)}, {"$set": {"stage": "treatment", "status": "Treatment Active", "treatment": payload.medicine, "updated_at": now}})
        except Exception:
            pass

    return serialize_id(treatment)


@app.patch("/api/treatments/{treatment_id}")
async def update_treatment(treatment_id: str, payload: dict[str, Any], user=Depends(require_roles("veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    try:
        oid = ObjectId(treatment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid treatment id.")
    existing = await db.treatments.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Treatment not found.")
    updates = {k:v for k,v in payload.items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)
    await db.treatments.update_one({"_id": oid}, {"$set": updates})
    updated = await db.treatments.find_one({"_id": oid})
    if updates.get("status") == "Completed" and updated.get("case_id"):
        try:
            await db.cases.update_one({"_id": ObjectId(updated["case_id"])}, {"$set": {"stage": "follow_up", "status": "Follow-up Required", "follow_up_date": updated.get("end_date"), "updated_at": datetime.now(timezone.utc)}})
        except Exception:
            pass
    return serialize_id(updated)


@app.get("/api/lab-tests")
async def list_lab_tests(status_filter: str | None = Query(None, alias="status"), case_id: str | None = None, user=Depends(get_current_user), db=Depends(get_db)):
    query: dict[str, Any] = {}
    if status_filter:
        query["status"] = status_filter
    if case_id:
        query["case_id"] = case_id
    if user["role"] == "farmer":
        owned_cases = await db.cases.find({"created_by": str(user["_id"])}, {"_id": 1}).to_list(length=500)
        query = {"$and": [query, {"case_id": {"$in": [str(x["_id"]) for x in owned_cases]}}]}
    cursor = db.lab_tests.find(query).sort("created_at", -1).limit(250)
    return {"items": [serialize_id(item) async for item in cursor]}


@app.post("/api/lab-tests", status_code=201)
async def create_lab_test(payload: LabTestCreate, user=Depends(require_roles("veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    if payload.case_id:
        try:
            case = await db.cases.find_one({"_id": ObjectId(payload.case_id)})
        except Exception:
            case = None
        if not case:
            raise HTTPException(status_code=404, detail="Related case not found.")
    now = datetime.now(timezone.utc)
    document = payload.model_dump()
    document.update({"created_by": str(user["_id"]), "created_at": now, "updated_at": now})
    result = await db.lab_tests.insert_one(document)
    created = await db.lab_tests.find_one({"_id": result.inserted_id})
    if payload.case_id:
        await db.cases.update_one({"_id": ObjectId(payload.case_id)}, {"$set": {"stage": "lab_test", "status": "Lab Processing", "updated_at": now}})
    await db.notifications.insert_one({"title":"Laboratory test requested","message":f"{payload.test_name} requested for {payload.animal_name}.","notification_type":"lab","target_role":"lab-staff","case_id":payload.case_id,"created_at":now,"read":False})
    return serialize_id(created)


@app.patch("/api/lab-tests/{test_id}")
async def update_lab_test(test_id: str, payload: LabTestUpdate, user=Depends(require_roles("lab-staff", "veterinarian", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    try:
        oid = ObjectId(test_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid lab test id.")
    existing = await db.lab_tests.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Lab test not found.")
    updates = {k:v for k,v in payload.model_dump().items() if v is not None}
    now = datetime.now(timezone.utc)
    if payload.status == "Completed":
        updates["completed_at"] = now
    updates["updated_at"] = now
    await db.lab_tests.update_one({"_id": oid}, {"$set": updates})
    updated = await db.lab_tests.find_one({"_id": oid})
    if payload.status == "Completed":
        await db.notifications.insert_one({"title":"Laboratory report available","message":f"Lab result is available for {existing.get('animal_name','animal')}.","notification_type":"lab","target_role":"veterinarian","case_id":existing.get("case_id"),"created_at":now,"read":False})
        if existing.get("case_id"):
            try:
                await db.cases.update_one({"_id": ObjectId(existing["case_id"])}, {"$set": {"lab_result": updates.get("result", existing.get("result")), "stage": "treatment", "status": "Vet Review", "updated_at": now}})
            except Exception:
                pass
    return serialize_id(updated)


@app.get("/api/follow-ups")
async def list_follow_ups(user=Depends(get_current_user), db=Depends(get_db), status_filter: str | None = Query(None, alias="status")):
    query: dict[str, Any] = {}
    if status_filter:
        query["status"] = status_filter
    if user["role"] not in {"veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin"}:
        query["created_by"] = str(user["_id"])
    cursor = db.follow_ups.find(query).sort("scheduled_date", 1).limit(250)
    return {"items": [serialize_id(item) async for item in cursor]}


@app.post("/api/follow-ups", status_code=201)
async def create_follow_up(payload: FollowUpCreate, user=Depends(require_roles("veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    now = datetime.now(timezone.utc)
    document = payload.model_dump()
    document.update({"created_by": str(user["_id"]), "created_at": now, "updated_at": now})
    result = await db.follow_ups.insert_one(document)
    if payload.case_id:
        try:
            await db.cases.update_one({"_id": ObjectId(payload.case_id)}, {"$set": {"stage":"follow_up","status":"Follow-up Scheduled","follow_up_date":payload.scheduled_date,"updated_at":now}})
        except Exception:
            pass
    return serialize_id(await db.follow_ups.find_one({"_id": result.inserted_id}))


@app.patch("/api/follow-ups/{follow_up_id}")
async def update_follow_up(follow_up_id: str, payload: FollowUpUpdate, user=Depends(require_roles("veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    try:
        oid=ObjectId(follow_up_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid follow-up id.")
    existing=await db.follow_ups.find_one({"_id":oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Follow-up not found.")
    updates={k:v for k,v in payload.model_dump().items() if v is not None}
    updates["updated_at"]=datetime.now(timezone.utc)
    await db.follow_ups.update_one({"_id":oid},{"$set":updates})
    updated=await db.follow_ups.find_one({"_id":oid})
    if payload.status == "Completed" and existing.get("case_id"):
        try:
            await db.cases.update_one({"_id":ObjectId(existing["case_id"])},{"$set":{"stage":"resolved","status":"Resolved","updated_at":datetime.now(timezone.utc)}})
        except Exception:
            pass
    return serialize_id(updated)


@app.post("/api/ai/analyze")
async def ai_analyze(
    payload: AIAnalysisRequest,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    symptoms = [item.strip().lower() for item in payload.symptoms if item and item.strip()]
    score = 10 + min(60, len(symptoms) * 12)

    if any(word in " ".join(symptoms) for word in ["high fever", "severe", "bleeding", "collapse", "breathing"]):
        score += 25

    if payload.temperature_c is not None:
        if payload.temperature_c >= 40 or payload.temperature_c <= 35:
            score += 20
        elif payload.temperature_c >= 39:
            score += 10

    score = min(100, score)

    if score >= 70:
        risk = "High"
    elif score >= 40:
        risk = "Medium"
    else:
        risk = "Low"

    result = {
        "risk": risk,
        "risk_score": score,
        "screening_note": "Prototype decision-support screening; not a veterinary diagnosis.",
        "possible_signals": symptoms[:6] or ["No symptoms supplied"],
        "recommended_next_action": (
            "Request veterinary review and consider field/lab investigation."
            if risk == "High"
            else "Review animal history and monitor symptoms."
        ),
        "created_by": str(user["_id"]),
        "created_at": datetime.now(timezone.utc),
    }

    if payload.animal_id:
        result["animal_id"] = payload.animal_id

    await db.ai_analyses.insert_one(dict(result))
    return result


@app.get("/api/outbreaks/summary")
async def outbreak_summary(user=Depends(require_roles("veterinarian", "field-worker", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    pipeline = [
        {"$match": {"stage": {"$ne": "resolved"}, "risk": {"$in": ["High", "Critical"]}}},
        {"$group": {"_id": {"village": "$village", "condition": "$condition"}, "cases": {"$sum": 1}, "latest": {"$max": "$created_at"}}},
        {"$sort": {"cases": -1}},
        {"$limit": 50},
    ]
    clusters=[item async for item in db.cases.aggregate(pipeline)]
    total_active=await db.cases.count_documents({"stage":{"$ne":"resolved"}})
    high=await db.cases.count_documents({"risk":"High","stage":{"$ne":"resolved"}})
    critical=await db.cases.count_documents({"risk":"Critical","stage":{"$ne":"resolved"}})
    return {"clusters":[{"village":x["_id"].get("village") or "Unknown","condition":x["_id"].get("condition") or "Unknown","cases":x["cases"],"latest":x["latest"]} for x in clusters],"total_active":total_active,"high":high,"critical":critical}


@app.get("/api/analytics/summary")
async def analytics_summary(user=Depends(require_roles("farmer", "farm-admin", "veterinarian", "field-worker", "staff", "district-admin", "state-admin", "super-admin")), db=Depends(get_db)):
    role=user["role"]
    scope={} if role in {"veterinarian","field-worker","staff","district-admin","state-admin","super-admin"} else {"created_by":str(user["_id"])}
    animals=await db.animals.count_documents({} if role in {"district-admin","state-admin","super-admin","veterinarian","field-worker","staff"} else {"owner_user_id":str(user["_id"])})
    cases=await db.cases.count_documents(scope)
    high=await db.cases.count_documents({**scope,"risk":"High"})
    critical=await db.cases.count_documents({**scope,"risk":"Critical"})
    resolved=await db.cases.count_documents({**scope,"stage":"resolved"})
    vaccinations=await db.vaccinations.count_documents(scope)
    treatments=await db.treatments.count_documents(scope)
    labs=await db.lab_tests.count_documents(scope)
    return {"animals":animals,"cases":cases,"high":high,"critical":critical,"resolved":resolved,"vaccinations":vaccinations,"treatments":treatments,"labs":labs}


@app.get("/api/notifications")
async def list_notifications(
    user=Depends(get_current_user),
    db=Depends(get_db),
    unread_only: bool = False,
):
    query = {
        "$or": [
            {"target_role": None},
            {"target_role": user["role"]},
            {"target_user_id": str(user["_id"])},
        ]
    }

    if unread_only:
        query["read"] = False

    cursor = db.notifications.find(query).sort("created_at", -1).limit(100)
    items = [serialize_id(item) async for item in cursor]
    return {"items": items, "count": len(items)}


@app.post("/api/notifications", status_code=201)
async def create_notification(
    payload: NotificationCreate,
    user=Depends(
        require_roles(
            "veterinarian",
            "district-admin",
            "state-admin",
            "super-admin",
        )
    ),
    db=Depends(get_db),
):
    document = payload.model_dump()
    document.update(
        {
            "created_by": str(user["_id"]),
            "created_at": datetime.now(timezone.utc),
            "read": False,
        }
    )

    result = await db.notifications.insert_one(document)
    created = await db.notifications.find_one({"_id": result.inserted_id})
    return serialize_id(created)


@app.get("/api/admin/users")
async def list_users(
    role: str | None = None,
    user=Depends(require_roles("super-admin", "state-admin")),
    db=Depends(get_db),
):
    query = {}
    if role:
        query["role"] = role

    cursor = db.users.find(
        query,
        {
            "password_hash": 0,
        },
    ).sort("created_at", -1)

    return {"items": [serialize_id(item) async for item in cursor]}
