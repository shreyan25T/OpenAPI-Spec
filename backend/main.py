from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()
origins = ["http://localhost:3000/"]

# origins = ["*"] # uncomment this line and comment above line, in case if you want applications from different IP address than this to connect to the end points in this FastAPI application.

app.add_middleware(
     CORSMiddleware,
     allow_origins=["http://localhost:3000"],
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"]
)
class SpecData(BaseModel):
    spec_data: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Read the content of the uploaded file
    contents = await file.read()
    # Convert bytes to string (assuming the file is in UTF-8 encoding)
    file_content = contents.decode("utf-8")

    # Return the content of the file as the response
    return JSONResponse(content={"filename": file.filename, "content": file_content})

@app.post("/test")
async def test_spec(data: SpecData):
    # Perform testing or validation logic here with the spec_data
    # For demonstration purposes, let's just return a mock result
    mock_result = f"Mock test result for spec data: {data.spec_data}"
    return JSONResponse(content={"result": mock_result})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
