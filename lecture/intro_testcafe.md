# Chapter 1: Introduction to TestCafe

#### Introduction to E2E testing
- It is a technique used to test whether the flow of an application right from start to finish is behaving as expected.
- End-to-end tests simulate real user scenarios - essentially, testing how a real user would use the application.
- The purpose of performing end-to-end testing is:
  - Identify system dependencies
  - Ensure that data integrity is maintained between various system components and systems.
- Horizontal end-to-end tests: Ensure that the user can functionally perform the main activities of the application
- End-to-end tests are used to verify our system or the entire application is working correctly and prevent bugs and regression to happen.
  
#### How TestCafe works
- TestCafe contains the following components:
  - Client-server
  - TestCafe API
  - Page proxying
  - Isolated tests
- The idea that defined TestCafe architecture was that we don't really need an external driver to run end-to-end tests in the browser  
- The page can run all the testing scripts that emulate user actions.

![](https://testautomationu.applitools.com/course55/chapter1-img1.png)

#### Design Concepts
- TestCafe uses a URL rewriting proxy instead of WebDriver with Selenium.
- The proxy injects the driver script that emulates user actions into a test page.
- It can emulate user actions, authentication, run its own script, and for the tested page - look like a real user is interacting with their website.
- It doesn't experience any direct scripts interface.

#### What are the benefits of using the server-side?
- Prepare a database or launch a web service from the tests
- You can access the server's file system to read the data or check the uploaded files
- Tests can use all Node.js features and external Node.js modules
- Tests became faster and more stable as test logic is now separated from the automation scripts
- Test code can't interrupt the page execution, because TestCafe doesn't inject user-written code
- The latest syntax features like async/await are supported also with TestCafe

#### Main types of interaction of TestCafe API
- Select elements
- Perform actions
- Execute assertions

#### Other important features
- NodeJS is required to install TestCafe
- TestCafe is using a URL-rewriting proxy instead of WebDriver
- TestCafe isolates each test run from subsequent tests and tests that run in parallel.
- After a test is completed, TestCafe resets the browser state:
  - Deletes cookies
  - Clear local and session storages
  - Reloads the tested page

#### Resources
![TestCafe Roadmap](https://devexpress.github.io/testcafe/roadmap/)

![TestCafe - How it works](https://devexpress.github.io/testcafe/documentation/how-it-works/)


![Source](https://testautomationu.applitools.com/testcafe-tutorial/chapter1.html)
   
