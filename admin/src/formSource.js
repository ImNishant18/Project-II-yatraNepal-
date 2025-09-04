export const userInputs = [
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "virat_18",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "timalsinanishant01@gmail.com",
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    placeholder: "+977 9843588764",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: "Nepal",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "Lalitpur",
  },
];


export const hotelInputs = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "My Hotel",
  },
  {
    id: "type",
    label: "Type",
    type: "text",
    placeholder: "hotel",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "Lalitpur",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Harisiddhi",
  },
  {
    id: "distance",
    label: "Distance from City Center",
    type: "text",
    placeholder: "500",
  },
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "The best Hotel in Harisiddhi",
  },
  {
    id: "desc",
    label: "Description",
    type: "text",
    placeholder: "description",
  },
  {
    id: "cheapestPrice",
    label: "Price",
    type: "text",
    placeholder: "1000",
  },
];

export const roomInputs = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "2 bed room",
  },
  {
    id: "desc",
    label: "Description",
    type: "text",
    placeholder: "King size bed, 1 bathroom",
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    placeholder: "100,101,102",
  },
  {
    id: "maxPeople",
    label: "Max People",
    type: "number",
    placeholder: "2",
  },
];

export const moneyexchangeInputs = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Exchange Center Name",
    required: true,
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Exchange Center Address",
    required: true,
  },
  {
    id: "lat",
    label: "Latitude",
    type: "number",
    placeholder: "27.7177",
    required: true,
    step: "0.00001",
    min: -90,
    max: 90,
  },
  {
    id: "lng",
    label: "Longitude",
    type: "number",
    placeholder: "85.3247",
    required: true,
    step: "0.00001",
    min: -180,
    max: 180,
  },
  {
    id: "contactNumber",
    label: "Contact Number",
    type: "text",
    placeholder: "+977 01 1234567",
    required: true,
  },
  {
    id: "hours",
    label: "Working Hours",
    type: "text",
    placeholder: "9 AM - 5 PM",
    required: true,
  },
  {
    id: "services",
    label: "Services",
    type: "text",
    placeholder: "Currency exchange, Money transfer, etc.",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    type: "text",
    placeholder: "Additional details",
    required: false,
  },
  {
    id: "isActive",
    label: "Active Status",
    type: "checkbox",
    placeholder: "",
    required: false,
  },
];

export const touristguideInputs = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Guide Name",
    required: true,
  },
  {
    id: "email",
    label: "User Email",
    type: "email",
    placeholder: "user@example.com",
    required: false,
  },
  {
    id: "location",
    label: "Location",
    type: "text",
    placeholder: "Kathmandu, Lalitpur, etc.",
    required: true,
  },
  {
    id: "language",
    label: "Language",
    type: "text",
    placeholder: "English, Nepali, etc.",
    required: true,
  },
  {
    id: "experience",
    label: "Experience (years)",
    type: "number",
    placeholder: "5",
    required: true,
  },
  {
    id: "contactNumber",
    label: "Contact Number",
    type: "text",
    placeholder: "+977 9843588764",
    required: true,
  },
  {
    id: "availability",
    label: "Availability",
    type: "text",
    placeholder: "Monday to Friday, 9 AM - 5 PM",
    required: true,
  },
  {
    id: "licenseNumber",
    label: "License Number",
    type: "text",
    placeholder: "LIC-123456",
    required: true,
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    multiple: true,
    placeholder: "Select Category",
    required: true,
    options: [
      { label: "Adventure", value: "Adventure" },
      { label: "Cultural", value: "Cultural" },
      { label: "Historical", value: "Historical" },
      { label: "Wildlife", value: "Wildlife" },
      { label: "Religious", value: "Religious" },
      { label: "Eco-tourism", value: "Eco-tourism" },
      { label: "Trekking", value: "Trekking" },
      { label: "Local Experience", value: "Local Experience" },
    ]
  },
];

export const placeInputs = [
  {
    id: "name",
    label: "Place Name",
    type: "text",
    placeholder: "Pasupathi Temple",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter a brief description of the place",
    required: true,
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "Kathmandu, Lalitpur, Bhaktapur, etc.",
    required: true,
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Full address of the place",
    required: true,
  },
];

export const chadParbaInputs = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "Dashain",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter event description",
    required: true,
  },
  {
    id: "nepaliMonth",
    label: "Nepali Month",
    type: "select",
    placeholder: "Select Nepali Month",
    required: true,
    options: [
      { label: "Baisakh", value: "Baisakh" },
      { label: "Jestha", value: "Jestha" },
      { label: "Ashadh", value: "Ashadh" },
      { label: "Shrawan", value: "Shrawan" },
      { label: "Bhadra", value: "Bhadra" },
      { label: "Ashwin", value: "Ashwin" },
      { label: "Kartik", value: "Kartik" },
      { label: "Mangsir", value: "Mangsir" },
      { label: "Poush", value: "Poush" },
      { label: "Magh", value: "Magh" },
      { label: "Falgun", value: "Falgun" },
      { label: "Chaitra", value: "Chaitra" },
    ],
  },
  {
    id: "nepaliDay",
    label: "Nepali Day",
    type: "number",
    placeholder: "10",
    required: true,
    min: 1,
    max: 32,
  },
  {
    id: "category",
    label: "Category",
    type: "text",
    placeholder: "Dashain",
    required: true,
  },
];

export const imageSliderInputs = [
  {
    id: "name",
    label: "Image Title",
    type: "text",
    placeholder: "Beautiful Landscape",
    required: true,
  },
];
