
# Cypress JavaScript Automation Project

## 📁 Sample Project Setup

- 📦 **Sample Project Path:**  
  [Google Drive - SampleProject.zip](https://drive.google.com/file/d/1R4UUOLo7gGB7MhZHLLJyjNiztIkcSNDl/view?usp=drive_link)  
  *(Google Drive — josephqaautomation@gmail.com)*

- 📂 **Instructions:**
  1. Download and unzip the project.
  2. Each of the two folders inside contains its own `README.md` — follow the instructions provided within.
  3. Start the **Backend** application first, then the **Frontend**.
  4. Ensure **MongoDB** is installed before proceeding.

---

## 🧩 Covered Modules

1. Areas  
2. Matches  
3. Players  
4. Teams

---

## ✅ Test Strategy

1. Each module is **individually tested**.
2. Implemented a **Page Object Model (POM)** structure with:
   - `e2e/page_objects`: UI element selectors
   - `e2e/page`: Reusable methods and module-specific logic
   - `e2e/tests`: Test specifications for each module
3. **UI validations** tested field-by-field across modules.
4. **End-to-end** scenarios are covered.
5. **Edge case** testing is included.
6. **Known bug cases** are intentionally tested to confirm failures.
7. **Mochawesome HTML reports** generated at:
   ```
   /cypress/reports/html
   ```
8. **Video recordings** of failed test cases stored at:
   ```
   /cypress/reports/html/videos
   ```
9. Some scenarios involve **API-based data creation** using JSON/XML files.
10. Loaded **1000+ player records** to validate large dataset handling.

---

## 🧪 Edge Case Scenarios (Known Failures: 7 Test Cases)

1. **Areas Module:** Allows duplicate area names.  
   👉 Should validate uniqueness by area name.

2. **Matches Module:** Permits duplicate match entries for same teams and date.  
   👉 Should validate by match name, teams, and date combination.

3. **Players Module:** 
   - `Team` field not mandatory in UI, but required in API.  
     ➤ Causes script error when omitted.
   - Email validation allows `@` but not a `.` after it.  
     ➤ Add full format validation.
   - Accepts future dates in `Date of Birth`.  
     ➤ Validate against current date.
   - Allows full duplicate player entries.  
     ➤ Uniqueness can be enforced via mobile number.

4. **Teams Module:** Allows duplicate team names.  
   👉 Should enforce uniqueness on team name at creation.

---

## 🚀 Running Automation Test Scripts

1. Unzip the project.
2. Open the folder using **Visual Studio Code**.
3. Open a new terminal.
4. Run:
   ```bash
   npm install
   ```
5. Execute tests:
   ```bash
   npx cypress run --headed --browser chrome
   ```