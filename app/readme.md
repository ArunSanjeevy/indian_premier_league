Project name: IPL

Node version: v12.18.1
MongoDB version: MongoDB 4.2.8
Framework used: Express JS

Setup:

1. Start the mongoDB server
2. Update the connection url in the respective config files in the config directory
3. Run import_data.js script with matches2d4c40a.csv in the same directory as the import_data.js file
4. If the data in matches2d4c40a.csv is not proper, the script would output validationErrors.json file in the same directory. 
5. Check for the errors in each record and update the csv accordingly. Corrected csv is available in the name "matches_data.csv", in the same directory
6. After correcting the data csv file. Re-run the run the script to upload the data successfully

Server start-up:
1. The application fetches the config from respective files based on the value of process.env.NODE_ENV. 
2. Valid values are 'dev','test','prod'. Application sets the default value as 'dev'
3. Run "npm start" to start the development server
4. Verify you can see the following message in terminal
    Server running on port 3000
    Application connected mongodb://localhost:27017/xxxxxxxxxx
5. Once server is up and running, please access "http://localhost:3000/api-docs" to open swagger ui documentation.

Running tests:
1. All the tests are integrated to the DB, so that test results are accurate.
2. Need MongoDB server running for the test cases to run successfully.
3. Tests connect to the test db configured in the test-config.json file
4. Tests populate the test data and clean up the same automatically
5. Run "npm test"
6. Total of 43 test cases will execute
7. Test coverage is about 89%. Test coverage report will be generated.

Notes:
 1. Please refer the env-config.json files to change the config values
 2. Application Logs will be generated under the logs/ directory


    