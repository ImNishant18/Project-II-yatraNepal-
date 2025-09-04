export const userColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250
  },
  {
    field: "user",
    headerName: "User",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },

  {
    field: "country",
    headerName: "Country",
    width: 100,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
  },
];

export const hotelColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 270
  },
  {
    field: "name",
    headerName: "Name",
    width: 240,
  },
  {
    field: "type",
    headerName: "Type",
    width: 140,
  },
  {
    field: "title",
    headerName: "Title",
    width: 270,
  },
  {
    field: "city",
    headerName: "City",
    width: 140,
  },
];

export const roomColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250
  },
  {
    field: "title",
    headerName: "Title",
    width: 220,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 380,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
];

export const moneyexchangeColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },
  {
    field: "name",
    headerName: "Name",
    width: 180,
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
  },
  {
    field: "lat",
    headerName: "Latitude",
    width: 120,
    valueFormatter: (params) => Number(params.value).toFixed(5),
  },
  {
    field: "lng",
    headerName: "Longitude",
    width: 120,
    valueFormatter: (params) => Number(params.value).toFixed(5),
  },
  {
    field: "contactNumber",
    headerName: "Contact Number",
    width: 150,
  },
];

export const touristguideColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },
  {
    field: "name",
    headerName: "Name",
    width: 180,
  },
  {
    field: "location",
    headerName: "Location",
    width: 180,
  },
  {
    field: "contactNumber",
    headerName: "Contact Number",
    width: 150,
  },
  {
    field: "experience",
    headerName: "Experience (Years)",
    width: 130,
  },
  {
    field: "language",
    headerName: "Language",
    width: 180,
  },
];

export const placeColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },
  {
    field: "name",
    headerName: "Name",
    width: 180,
  },
  {
    field: "city",
    headerName: "City",
    width: 150,
  },
  {
    field: "category",
    headerName: "Category",
    width: 130,
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
  },
];

export const chadParbaColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },
  {
    field: "title",
    headerName: "Title",
    width: 180,
  },
  {
    field: "nepaliMonth",
    headerName: "Nepali Month",
    width: 130,
  },
  {
    field: "nepaliDay",
    headerName: "Nepali Day",
    width: 100,
    type: "number",
  },
  {
    field: "category",
    headerName: "Category",
    width: 180,
  },
];

export const imageSliderColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 270,
  },
  {
    field: "name",
    headerName: "Title",
    width: 200,
  },
  {
    field: "imageType",
    headerName: "Type",
    width: 140,
  },
  {
    field: "imagePath",
    headerName: "Image URL",
    width: 300,
    renderCell: (params) => (
      <img src={params.value} alt={params.row.name} style={{ width: 100, height: 50, objectFit: "cover" }} />
    ),
  },
];
