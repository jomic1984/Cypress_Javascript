# Cypress_Javascript

Covered Modules:

	1. Areas.
	2. Matches.
	3. Players.
	4. Teams.

Test Strategy:

	1. Individually tested each modules.

	2. Followed POM framework such that under e2e folder 3 sub-folders will be presented (page_objects / page / tests).

	3. page_objects folder consists of only the objects of the elements based on the module.

	4. page folder will have the methods and functions specific to the modules.

	5. tests folder will have the spec files specific to the modules.

	6. Individually tested the UI validations for each fields in each Modules.

	7. Covered End-2-End Scenario.

	8. Edge Case scenario has also been covered in the testcases.

	9. Have created the test case which would potentially fail because of the bug in the application.

	10. created the html report - ..cypress\reports\html. Have used mochawesome report generator.

	11. Video recordings for the failure testcases will be stored - ..cypress\reports\html\videos\

	12. For some of the scenarios used API calls for creating the data by using XML and JSON files.

	13. Loaded Player data of 1000 count to check the application response

Test Outputs:

	Total Testcases Covered: 38
	Passing 	       : 31
	Failure		       : 7

Edge-Case scenarios for which I failed the 7 test cases:

	1. In Areas module the application is allowing the user to create the same data multiple times. Which is logically wrong. We can validate by Area name.

	2. In Matches module the application is allowing the user to create multiple matches with the same Match name , with the same team on the same date, which is wrong. We can validate this by Match name and its row properties.

	3. In Players module in the UI "Team" field is not marked as mandatory, but as per the API calls it is mandatory. So If I not update the field and click on Add button the application is giving me the script error.

	4. Also in the players module for the Email validation '@' symbol is being validated but '.' is not validated after the '@' symbol. We need to add '.' parameter in the application.

	5. In the players module the application is allowing to update the future date for the Date of birth which is logically wrong. We can validate this by comparing the current date with the date entered.

	6. In Players module the application is allowing for the duplicate of players with exact data. We can validate by using Mobile number.

	7. In Teams module the application is allowing user to create the same team name multiple times. We can validate this by comparing the team name with the exisitng team name after we click the Add button.

Followed the setup of the application with the application UI url : http://localhost:3001/

Running of Automation Test Scripts:

	1. Unzip the file.
	2. Open the folder in Visual Studio Code.
	3. Open a new terminal
	4. Type this command in the terminal - npm install
	5. Type this command in the terminal - npx cypress run --headed --browser chrome


