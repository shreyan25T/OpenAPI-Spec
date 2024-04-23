import uvicorn
import yaml
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os
from utils.gen_utc import test_case_generator
from utils.events import app_startup
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from constants import *
from utils.gen_utc import create_zip_file
from fastapi.responses import FileResponse

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


@app.exception_handler(Exception)
def validation_exception_handler(request, err):
    base_error_message = f"Failed to execute: {request.method}: {request.url}"
    return JSONResponse(
        status_code=400, content={"message": f"{base_error_message}. Detail: {err}"}
    )


@app.post("/home/upload")
async def upload_and_gen_utc(file: UploadFile = File(...)):
    yaml_file_path = os.path.join(download_dir, str(file.filename).strip().replace(" ", "_"))
    if file.filename.endswith(".yaml") or file.filename.endswith(".yml"):
        try:
            contents = await file.read()
            _ = yaml.safe_load(contents)
        except yaml.YAMLError as e:
            return {"status": "error", "message": "Invalid YAML file."}
        with open(yaml_file_path, "wb") as f:
            f.write(contents)
        spec_data = SpecData(spec_content=contents, spec_file_path=yaml_file_path)
        return {"status": "success", "data": spec_data}
    else:
        return {"status": "error", "message": "kindly, upload yaml file"}


@app.post("/home/test")
async def test(spec_data: SpecData):
    try:
        _ = yaml.safe_load(spec_data.spec_content)
    except yaml.YAMLError as e:
        return {"status": "error", "message": "Invalid YAML file."}

    with open(spec_data.spec_file_path, "w") as f:
        f.write(spec_data.spec_content)
    test_case_generator(spec_data.spec_file_path)
    return {"status": "success"}

@app.get("/home/download-zip")
async def download_zip_file():
    zip_file_path = create_zip_file()
    return FileResponse(zip_file_path, media_type='application/zip', filename='test_files.zip')

if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
