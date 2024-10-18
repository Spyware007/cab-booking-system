# Cab Booking System

A Next.js 14 application for managing cab bookings.

## Setup and Installation

1. Clone the repository:

```bash
git clone https://github.com/spyware007/cab-booking-system.git
cd cab-booking-system
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Create a `.env.local` file in the root directory with the following content:

```bash
MONGODB_URI= your_mongodb_uri
NEXTAUTH_SECRET= your_nextauth_secret
NEXTAUTH_URL= http://localhost:3000
MAIL_HOST= smtp.gmail.com
EMAIL_USER= user_email
EMAIL_PASS= email_pass
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- User authentication
- Cab booking management
- Admin panel for managing locations, routes, and cabs
- Email notifications

## Screenshots

<table>
<tr>
 <td><img src="readme_assets/image1.png" width="250" alt="Home Page"></td>
 <td><img src="readme_assets/image2.png" width="250" alt="Booking Form"></td>
 <td><img src="readme_assets/image3.png" width="250" alt="Admin Dashboard"></td>
</tr>
<tr>
 <td><img src="readme_assets/image4.png" width="250" alt="Location Management"></td>
 <td><img src="readme_assets/image5.png" width="250" alt="Route Management"></td>
 <td><img src="readme_assets/image6.png" width="250" alt="Cab Management"></td>
</tr>
<tr>
 <td><img src="readme_assets/image7.png" width="250" alt="Booking History"></td>
 <td><img src="readme_assets/image8.png" width="250" alt="User Profile"></td>
 <td></td>
</tr>
</table>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
