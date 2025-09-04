import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 102938,
      service: "Everest Base Camp Trek",
      img: "https://www.earthtrekkers.com/wp-content/uploads/2020/05/Everest-Base-Camp-Trek-in-Photos.jpg",
      customer: "Nishant Timalsina",
      date: "21 May",
      amount: 1200,
      method: "Online Payment",
      status: "Approved",
    },
    {
      id: 394820,
      service: "Pokhara Sightseeing Tour",
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/88/53/b3/caption.jpg?w=500&h=400&s=1",
      customer: "Sujan Gurung",
      date: "20 May",
      amount: 300,
      method: "Cash on Arrival",
      status: "Pending",
    },
    {
      id: 483920,
      service: "Chitwan Jungle Safari",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBcabKMd-F7mBqCSaQ198deh_3PX96gFcoJw&s",
      customer: "Emma Rai",
      date: "18 May",
      amount: 450,
      method: "Online Payment",
      status: "Approved",
    },
    {
      id: 582394,
      service: "Lumbini Pilgrimage Tour",
      img: "https://hwwtreks.com/uploads/0000/1/2021/03/06/lmb0010.jpg",
      customer: "John Lama",
      date: "17 May",
      amount: 250,
      method: "Cash on Arrival",
      status: "Pending",
    },
    {
      id: 109283,
      service: "Annapurna Circuit",
      img: "https://www.shutterstock.com/image-photo/annapurna-circuit-trek-act-gurung-600nw-2506511357.jpg",
      customer: "Aarav Sharma",
      date: "15 May",
      amount: 980,
      method: "Online Payment",
      status: "Approved",
    },
  ];

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="tour bookings table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Booking ID</TableCell>
            <TableCell className="tableCell">Tour Package</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Amount ($)</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt={row.service} className="image" />
                  {row.service}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.customer}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;