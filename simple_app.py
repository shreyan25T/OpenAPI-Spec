from fastapi import FastAPI, Request, Form
from pydantic import BaseModel
from typing_extensions import Annotated

app = FastAPI()

class FormData(BaseModel):
    longitude: float
    latitude: float

@app.get('/home')
async def gethome(request: Request):
    ctx = {'request': request}
    return str(ctx)

@app.post('/home')
async def posthome(request: Request, data: Annotated[FormData, Form()]):
    ctx = {'request': request, 'data': data}
    return str(ctx)
