@echo off
echo Starting Jaya Janardhana All-in-One...
start cmd /k "cd backend && npm run dev"
start cmd /k "cd next-subscription && npm run dev"
echo All modules are starting. 
echo Subscriptions ^& Storefront: http://localhost:3002
echo Backend API: http://localhost:5000
pause
