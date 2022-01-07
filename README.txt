1. Create .env file and configure
a. PORT
b. MONGO_URI
c. JWT_SECRET

APIs EndPoint:-

1. ROUTES FOR AUTHENTICATION

a. Signup (POST REQUEST):

http://localhost:{PORT}/auth/signup 

b. Login (POST REQUEST):

http://localhost:{PORT}/auth/login 
  

2. ROUTES FOR EXPENSES 

a. Get All Expenses (GET REQUEST):

http://localhost:{PORT}/expense/all-expenses  

b. Get Latest Expenses (Last 5 expenses)  (GET REQUEST):

http://localhost:{PORT}/expense/latest-expenses  

c. Add Expense (POST REQUEST):

http://localhost:{PORT}/expense/add-expense

d. Get Expense (GET REQUEST):

http://localhost:{PORT}/expense/getExpense/{ID_OF_EXPENSE}

e. Update Expense (PUT REQUEST):

http://localhost:{PORT}/expense/update-expense

f. Delete Expense (DELETE REQUEST):

http://localhost:{PORT}/expense/delete-expense/{ID_OF_EXPENSE}

g. Reminder Of Payments (GET REQUEST)

http://localhost:{PORT}/expense/reminder_of_payment


3. ROUTES FOR INCOME

a. ADD INCOME (POST REQUEST):

http://localhost:{PORT}/income/add-income

b. GET ALL INCOMES (GET REQUEST):

http://localhost:{PORT}/income/all-income

c. GET INCOME (GET REQUEST):

http://localhost:{PORT}/income/get-income/{ID_OF_INCOME}

d. UPDATE INCOME (PUT REQUEST):

http://localhost:{PORT}/income/update-income

e. DELETE INCOME (DELETE REQUEST):

http://localhost:{PORT}/income/delete-income/{ID_OF_INCOME}

f. REMAINDER OF INCOME (GET REQUEST):

http://localhost:{PORT}/income/remainder-income

