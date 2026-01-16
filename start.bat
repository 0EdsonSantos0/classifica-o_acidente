@echo off
echo ====================================
echo Iniciando projeto Probest
echo ====================================

REM ==========================
REM MOVER NOVO MODELO
REM ==========================
echo Atualizando modelo... 

if exist application\backend\model\naive_bayes_acidentes.pkl (
    del application\backend\model\naive_bayes_acidentes.pkl 
)

copy data\model\naive_bayes_acidentes.pkl application\backend\model\ 

echo Modelo atualizado com sucesso.
echo. 

REM ==========================
REM BACKEND (FLASK)
REM ==========================
echo Iniciando Backend Flask... 
cd application\backend 

REM Criar venv se não existir
if not exist venv (
    python -m venv venv 
)

call venv\Scripts\activate 

echo Instalando/Verificando dependencias...
REM Adicionado 'tensorflow' que estava faltando e 'Pillow' que e comum em projetos de imagem
python -m pip install flask flask-cors opencv-python scikit-learn tensorflow Pillow 

start cmd /k python app.py 

cd ..\.. 

REM ==========================
REM FRONTEND
REM ==========================
echo Iniciando Frontend... 
cd application\frontend 
start cmd /k python -m http.server 8000 
cd ..\.. 

echo ====================================
echo Sistema rodando! [cite: 3]
echo Backend: http://localhost:5000 [cite: 3]
echo Frontend: http://localhost:8000 [cite: 3]
echo ====================================
pause [cite: 3]