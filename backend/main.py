import uvicorn
import yaml
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os
from utils.gen_utc import test_case_generator
from utils.events import app_startup
from fastapi import FastAPI, UploadFile, File,Request
from pydantic import BaseModel
from constants import *
from utils.gen_utc import create_zip_file
from fastapi.responses import FileResponse
import uuid
from typing import List
from fastapi import HTTPException
from selenium_test import create_sel_func

app = FastAPI()
app.add_event_handler("startup", app_startup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class SpecData(BaseModel):
    spec_content: str
    spec_file_path: str
    spec_uuid: str

class RowData(BaseModel):
    id: int
    by: str
    byInput: str
    action: str
    actionInput: str


@app.exception_handler(Exception)
def validation_exception_handler(request, err):
    base_error_message = f"Failed to execute: {request.method}: {request.url}"
    return JSONResponse(
        status_code=400, content={"message": f"{base_error_message}. Detail: {err}"}
    )


@app.post("/home/upload")
async def upload_and_gen_utc(file: UploadFile = File(...)):
    uuid_str = str(uuid.uuid4())
    yaml_file_dir = os.path.join(download_dir, uuid_str)
    os.makedirs(yaml_file_dir, exist_ok=True)
    yaml_file_path = os.path.join(yaml_file_dir, str(file.filename).strip().replace(" ", "_"))
    if file.filename.endswith(".yaml") or file.filename.endswith(".yml"):
        try:
            contents = await file.read()
            _ = yaml.safe_load(contents)
        except yaml.YAMLError as e:
            return {"status": "error", "message": "Invalid YAML file."}
        with open(yaml_file_path, "wb") as f:
            f.write(contents)
        spec_data = SpecData(spec_content=contents, spec_file_path=yaml_file_path, spec_uuid=uuid_str)
        return {"status": "success", "data": spec_data}
    else:
        return {"status": "error", "message": "kindly, upload yaml file"}


@app.post("/home/test")
async def test(spec_data: SpecData, locust_flag: str | None = None):
    try:
        _ = yaml.safe_load(spec_data.spec_content)
    except yaml.YAMLError as e:
        return {"status": "error", "message": "Invalid YAML file."}

    # Create a folder with the same UUID in the /tests folder
    test_folder_path = os.path.join(test_dir, spec_data.spec_uuid)
    os.makedirs(test_folder_path, exist_ok=True)

    # Write the spec_content to a file in the test folder
    spec_data.spec_file_path = os.path.join(test_folder_path, "spec.yaml")

    with open(spec_data.spec_file_path, "w") as f:
        print("spec_uuid",spec_data.spec_uuid)
        print("spec_path",spec_data.spec_file_path)

        f.write(spec_data.spec_content)
    test_case_generator(spec_data.spec_file_path, test_folder_path, locust_flag)
    return {"status": "success"}

@app.get("/home/download-zip")
async def download_zip_file(unique_session_id=str):
    print("UNIQUE",unique_session_id)
    zip_folder_path = os.path.join(test_dir, unique_session_id)
    zip_file_path = create_zip_file(zip_folder_path)
    print("ZIP path",zip_file_path)
    return FileResponse(zip_file_path, media_type='application/zip', filename='test_files.zip')


@app.post("/selenium/test")
async def process_data(request: Request):
    try:
        request_body = await request.json()
        url = request_body.get("url")  
        data = request_body.get("data")

        if url is None or data is None:
            raise HTTPException(status_code=400, detail="Invalid request body")

        print("Received URL:", url)
        print("Received data:", data)
        create_sel_func(url,data)

        return JSONResponse(content={"message": "Data received successfully"})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing data: {str(e)}")




if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
