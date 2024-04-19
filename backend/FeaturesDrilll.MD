### Auto Generate Testcases Files

## Unit test cases for API endpoints

# Part - I

1. UTCGen should be able to generate test cases for API endpoints from the OpenAI Swagger YAML or JSON file
   1.1 Need to create parser for YAML file
   1.2 Need to create parser for JSON file
   1.3 Create test cases for API endpoints in a separate folder
   1.4 Run test cases and show the results after creation of test cases
2. UTCGen should also generate the pipeline code to run the app in docker and run the tests
   2.1 Need to create a sample yaml azure pipeline code for running test cases
3. UTCGen should also create artifacts from the test results and communicate them
   3.1 Need to create code to capture the test case results
   3.2 Need to create code to store the data in a HTML format
   3.3 Need to communicate the HTML in an email
4. Update the README.md file to let the user know how to run the code

## Unit test cases for all python files except the API endpoints

# Part - II

1. User inputs the folder where the code resides
2. UTCGen goes through each single folder and file in the Code folder
3. UTCGen generates test cases for every function or class method found in the code folder
4. Update the README.md file to let the user know how to run the code
