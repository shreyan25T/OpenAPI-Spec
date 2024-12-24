import os
import tempfile
import uuid
from typing import List, Optional

import pandas as pd
import uvicorn
import yaml
from constants import *
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from selenium_test import create_sel_func
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from utils.events import app_startup
from utils.gen_utc import (
    create_zip_file,
    create_zip_file_sel,
    test_case_generator,
    manual_test_case_generator,
)
from utils.selenium_gen import generate_code

app = FastAPI()
app.add_event_handler("startup", app_startup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://kind-sand-04f40700f.4.azurestaticapps.net"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# # Mount the static build directory
# app.mount("/static", StaticFiles(directory="static/static"), name="static")


# # Serve index.html for the root path
# @app.get("/")
# async def serve_root():
#     return FileResponse("static/index.html")


class SpecData(BaseModel):
    spec_content: str
    spec_file_path: Optional[str] = None
    spec_uuid: Optional[str] = None
    test_cases: Optional[list] = None


class ManualTestCases(BaseModel):
    title: str
    base_url: str
    test_cases: list


@app.exception_handler(Exception)
def validation_exception_handler(request, err):
    base_error_message = f"Failed to execute: {request.method}: {request.url}"
    return JSONResponse(
        status_code=400, content={"message": f"{base_error_message}. Detail: {err}"}
    )


@app.post("/home/upload")
async def upload_and_gen_utc(file: UploadFile = File(...)):
    if file.filename.endswith(".yaml") or file.filename.endswith(".yml"):
        try:
            contents = await file.read()
            _ = yaml.safe_load(contents)
        except yaml.YAMLError as e:
            return {"status": "error", "message": "Invalid YAML file."}
        spec_data = SpecData(spec_content=contents)
        return {"status": "success", "data": spec_data}
    else:
        return {"status": "error", "message": "kindly, upload yaml file"}


@app.post("/home/test")
async def test(spec_data: SpecData, locust_flag: str | None = None):
    try:
        openapi_content = yaml.safe_load(spec_data.spec_content)

    except yaml.YAMLError as e:
        print(e)
        return JSONResponse(
            status_code=400, content={"status": "error", "message": "invalid yaml"}
        )

    with tempfile.NamedTemporaryFile(
        mode="w", delete=False, suffix=".yaml"
    ) as temp_file:
        yaml.dump(openapi_content, temp_file)
        temp_file_path = temp_file.name

    # # Create a folder with the same UUID in the /tests folder
    # test_folder_path = os.path.join(test_dir, spec_data.spec_uuid)
    # # os.makedirs(test_folder_path, exist_ok=True)

    # # Write the spec_content to a file in the test folder
    # spec_data.spec_file_path = os.path.join(test_folder_path, "spec.yaml")

    variable_name = "API_URL"
    variable_value = "https://api.example.com"

    # with open(spec_data.spec_file_path, "w") as f:
    #     print("spec_uuid", spec_data.spec_uuid)
    #     print("spec_path", spec_data.spec_file_path)
    #     print("testcases", spec_data.test_cases)

    #     f.write(spec_data.spec_content)

    return test_case_generator(temp_file_path, locust_flag)


# Manual Test cases generation
@app.post("/home/manual-test")
async def manual_test(manual_data: ManualTestCases):
    return manual_test_case_generator(manual_data)


# Download ZIP file
@app.get("/home/download-zip")
async def download_zip_file(unique_session_id=str):
    print("UNIQUE", unique_session_id)
    zip_folder_path = os.path.join(test_dir, unique_session_id)
    zip_file_path = create_zip_file(zip_folder_path)
    print("ZIP path", zip_file_path)
    return FileResponse(
        zip_file_path, media_type="application/zip", filename="test_files.zip"
    )


@app.post("/selenium/test")
async def process_data(request: Request):
    received_data = await request.json()
    uuid_str = str(uuid.uuid4())
    # Extract the data from the received JSON
    url = received_data.get("url", "")
    pathDriver = received_data.get("pathDriver", "")
    data = received_data.get("data", [])
    print("data", data)
    # Process the received data
    df = pd.DataFrame(data)
    if "actionInput" not in df.columns:
        df["actionInput"] = ""

    df["actionInput"] = df["actionInput"].fillna("")
    df["useWait"] = df["byWait"].str.len() > 0
    generate_code(
        {
            "url": url,
            "pathDriver": pathDriver,
            "operations": df.fillna("").to_dict(orient="records"),
        }
    )

    return {
        "status": "success",
        "message": "Selenium script generated",
        "uuid": uuid_str,
    }


@app.get("/selenium/download-zip")
async def download_zip_file(unique_session_id=str):
    return FileResponse(
        "generate_codes_file.py",
        media_type="text/x-python",
        filename="test_selenium.py",
    )

@app.get("/buildnumber")
async def get_buildnumber():
    return os.environ['BUILD_NUMBER']


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
