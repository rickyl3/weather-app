# Weather App

A simple, responsive weather application that shows the current conditions and the conditions for tomorrow based on the user's location. The app supports the ability to switch between temperature units(celsius and fahrenheit), location search based on the user's input or location, and optional code to host the application in a cloud environment. The IaC utilizes Terraform, and AWS(S3 + CloudFront)

The application is currently being deployed [at this link](https://d1l5yntgq8m69p.cloudfront.net) from my AWS account through the use of Terraform for demonstration purposes if you are unable to run it locally

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/rickyl3/weather-app.git
cd weather-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
1. Sign up for a free weather API key at [WeatherAPI.com](https://www.weatherapi.com/)
2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Input the free weather API key into `.env`
```env
REACT_APP_WEATHER_API_KEY=your_actual_api_key_here
```

### 4. Run Locally
```bash
npm start
```

This will create the weather application at [http://localhost:3000](http://localhost:3000)


## Optional Terraform Deployment

### Prerequisites
1. [Have Terraform installed](https://developer.hashicorp.com/terraform/install)

2. Configure AWS credentials
```bash
aws configure
```

### 1. Create Terraform Variables File
Terraform requires a unique S3 bucket name so:
```bash
cd infra

cp terraform.tfvars.example terraform.tfvars
```

**Edit '/infra/terraform.tfvars`**:
```hcl
# Required to change
bucket_name             = "put-unique-bucket-name-here"

# Optional to change
aws_region              = "us-east-1"
environment             = "production"
cloudfront_price_class  = "PriceClass_100"
```

### 2. Initialize Terraform
```bash
cd infra

terraform init
```

### 3. Preview Changes
```bash
terraform plan
```

### 4. Create Infrastructure
```bash
terraform apply
```

### 5. Build and Deploy Application
```bash
cd .. 

npm run build

aws s3 sync ./build s3://put-unique-bucket-name-here --delete

aws cloudfront create-invalidation \
  --distribution-id your-distribution-id-here \
  --paths "/*"
```
Remember to replace `put-unique-bucket-name-here` and `your-distribution-id-here` accordingly

### 6. Access The Application
```bash
cd infra

terraform output cloudfront_url
```

Paste the url given from the output into your browser

## Author
Created by Ricky Leung