from fastapi import FastAPI, Request

app = FastAPI()

@app.get('/home')
async def gethome(request: Request):
    ctx = {'request': request}
    return str(ctx)
