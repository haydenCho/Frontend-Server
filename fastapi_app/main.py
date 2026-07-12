from fastapi import APIRouter, FastAPI

app = FastAPI()

# setup_nginx.sh 는 "/api/" 로 시작하는 요청만 이 서버로 프록시하며,
# 경로를 바꾸지 않고 그대로 전달한다. 따라서 라우트도 "/api" 로 시작해야
# 웹서버(nginx)를 통해 실제로 이 서버에 붙는다.
router = APIRouter(prefix="/api")


@router.get("/")
def read_root():
    return {"message": "FastAPI 서버가 정상적으로 실행 중입니다."}


@router.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(router)
