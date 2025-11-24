# Design Decisions and How I Would Scale My Solution

## 0. Initial Thought Process and Context
From reading the requirements and deliverables, I decided to try and implement the MVP(only Technical Requirements) before working on any of further features. This was because I was aware of the time limit of the technical assignment and I wanted to give myself sufficient time for in the case where I ran into any serious problems. However, I knew that I still wanted to implement at least 2 of the optional deliverables(luckily, I was able to) so I tried my best to get through the MVP as fast as possible.

---

## 1. Technology Choices
### Frontend: React
Although I have a small amount of experience in React and Angular, I ended up choosing React because I knew that one of the bottlenecks that I could possibly run into is not being able to effectively utilize the weather API. By being able to separate each feature into their own components, testing is significantly easier.


### WeatherAPI.com
Free and single endpoint that provides all of the necessary information for the technical requirements of the assignment.

---

## 2. Repository Organization and Architecture Decisions
I tried to focus on separation of concerns through components as much as possible. For example, I chose to create a **single `WeatherCard` component** instead of building three separate components for current, today, and tomorrow weather. If separate components were created, there would be a lot of code being copy and pasted across each componenet.

**Custom `useWeather` hook**: Was created to handle the fetching of the weather data that is separate from the UI components. This made testing significantly easier since I could test the data fetching logic independently from the UI.

**Util folder**: Consists of a lot of the utility functions that would be used for components later on. For example, temperature unit conversion functions.


### How I Implemented the Favorites Feature
Aside from code to host the application in a cloud environment(IaC), the favorites feature was one of the optional deliverables I chose to implement.

**Architecture Choice**: I used **localStorage for persistence** instead of setting up a backend. Since MVP didn't require a backend infrastructure, I felt that creating one strictly for this feature would be overkill. However, as explained later, if we were to scale this application, it would be much better to create an actual backend infrastructure.

**Why localStorage**:
I chose localStorage because it offers instant read/write with no API latency, works offline, and requires zero backend setup. For single-device usage, it's perfect. The 2 main issues are that favorites can't synced across devices and the size limits(*In Chrome, localStorage has a 5 MB limit so I limited the max favorite amount to 10*). If this were a production app with user accounts, I would migrate to a backend database to fix these issues.

### How I Implemented the Terraform IaC
I didn't have prior experience with Terraform prior to this assignment but I wanted to challenge myself a little bit since I had extra time and I felt that IaC would be something I would have to learn in my career eventually anyway. Luckily for me, it wasn't too bad.

**S3 Bucket**: AWS S3 can be used to host static websites so I made sure to utilize that to host my weather app in case there are issues with running it locally.

**CloudFront**: I'm aware that this is commonly paired with S3 static website hosting so I decided to include it. Although this website won't receive much traffic, it typically acts as a CDN(Content Delivery Network) so it would make the app much faster.

### Error Handling
I tried my best to implement error messages for as many different scenarios as I can think of(i.e. network issues, invalid locations, API key problems). This made testing a lot easier and it tends to be good practice for improving the user experience by giving them actionable feedback.

---

## 3. Implementation Order: MVP First vs. Infrastructure First
### My Approach: MVP First
Given the time constraint, I built the weather app with all of the technical requirements first. Then, I moved onto adding the optional features(Terraform and CI/CD, and favoriting locations). I wanted to make sure I had a working product to submit even if I ran out of time.

### Real-World Approach: Infrastructure First
**If I knew for a fact that I had enough time**, I would have taken the following approach:
1. Set up Terraform infrastructure first
2. Configure the CI/CD pipeline
3. Build the MVP of the weather app
4. Build the further features of the weather app


Every commit would deploy automatically, so I would almost never have to worry about it. Likewise, if test cases were implemented, they would also be a part of the CI/CD pipeline so I don't have to run the tests manually. From my understanding, this is how development typically works since issues can be caught much earlier, and a lot of time can be saved.

---

## 4. Ideas for Scaling to Production
Right now, the weather app runs in a single production environment with manual secret management. I don't have monitoring or automated tests set up, and error handling is fairly basic. The favorites feature uses localStorage, which works well for the MVP but is limited to the user's current device.

### Multiple Environments
- Set up three separate environments with automated deployments:
  ```
  Dev (auto-deploy from 'develop' branch)
    |
    V
  Staging (auto-deploy from 'staging' branch)
    |
    V
  Production (manual approval from 'main' branch)
  ```
- Use Terraform workspaces to keep environments separate
- Each environment would get their own S3 bucket and CloudFront distribution

### Enhanced CI/CD Pipeline
From my experience, the pipeline would be a lot more thorough and includes a lot of the following:
- Lint and type checks
- Run unit and component tests
- Build the application
- Run E2E tests

### Logs
Utilize CloudWatch to have logs for the website. From this, we can see whenever there would be API errors and performance metrics of the weather app. 


### Building an Actual Backend(Here is a simple example of one)
From the example, it would be possible to create user accounts to store location favorites across multiple devices.
```
Frontend --> API Gateway + Lambda --> WeatherAPI.com
                |
                V
           DynamoDB (caching + user data + favorites)
```