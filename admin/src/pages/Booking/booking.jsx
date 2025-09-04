import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faMoneyBillWave,
  faClock,
  faSpinner,
  faBan,
  faCheckCircle,
  faUser,
  faHotel,
  faBed,
  faTimesCircle,
  faCheck,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import "./booking.css";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

const API_BASE_URL = "http://localhost:8800/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await axios.get(`${API_BASE_URL}/reservations`, {
        params,
        withCredentials: true
      });
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, action) => {
    try {
      setActionLoading(true);
      const endpoint = action === "approve-cancel" ? "approve-cancel" : "reject-cancel";
      await axios.put(
        `${API_BASE_URL}/reservations/${bookingId}/${endpoint}`,
        {},
        { withCredentials: true }
      );
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
      setExpandedId(null);
    }
  };

  const formatDate = d => new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const nightsBetween = (s, e) => Math.ceil((new Date(e) - new Date(s)) / (1000 * 60 * 60 * 24));

  const statusBadge = status => {
    const map = {
      confirmed: ["Confirmed", faCheckCircle, "confirmed"],
      cancelled: ["Cancelled", faBan, "cancelled"],
      pending: ["Pending", faSpinner, "pending"],
      cancel_requested: ["Cancel Requested", faTimesCircle, "cancel-requested"]
    };
    const [label, icon, cls] = map[status] || ["Unknown", faBan, "unknown"];
    return <span className={`badge ${cls}`}><FontAwesomeIcon icon={icon} spin={status === "pending"} /> {label}</span>;
  };

  if (loading) return <div className="admin-loading"><FontAwesomeIcon icon={faSpinner} spin size="3x" /></div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="admin-bookings-container">
          <div className="filters">
            {["all", "cancel_requested", "confirmed", "cancelled"].map(f =>
              <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f.replace("_", " ").replace(/\b\w/g, ch => ch.toUpperCase())}
              </button>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="no-data">No bookings found.</div>
          ) : (
            <div className="bookings-table">
              <table>
                <thead><tr>
                  <th>ID</th><th>Hotel</th><th>User</th><th>Dates</th><th>Total</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {bookings.map(b => {
                    const sd = b.dates[0], ed = b.dates.at(-1), nights = nightsBetween(sd, ed);
                    const isCancelReq = b.status === "cancel_requested";

                    return (
                      <tr key={b._id}>
                        <td>#{b._id.slice(-6)}</td>
                        <td><FontAwesomeIcon icon={faHotel} /> {b.hotelId?.name}</td>
                        <td><FontAwesomeIcon icon={faUser} /> {b.userId?.username}</td>
                        <td>
                          <div><FontAwesomeIcon icon={faCalendarDays} /> {formatDate(sd)}</div>
                          <div>to {formatDate(ed)} ({nights} nights)</div>
                        </td>
                        <td><FontAwesomeIcon icon={faMoneyBillWave} /> Rs. {b.totalPrice.toLocaleString()}</td>
                        <td>{statusBadge(b.status)}</td>
                        <td className="actions">
                          {isCancelReq && (
                            <>
                              <button
                                disabled={actionLoading}
                                onClick={() => updateStatus(b._id, "approve-cancel")}
                                title="Approve Cancellation"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                disabled={actionLoading}
                                onClick={() => updateStatus(b._id, "reject-cancel")}
                                title="Reject Cancellation"
                              >
                                <FontAwesomeIcon icon={faTimesCircle} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setExpandedId(expandedId === b._id ? null : b._id)}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {expandedId && bookings.find(b => b._id === expandedId) && (
                <div className="modal">
                  <div className="modal-content">
                    <button className="close" onClick={() => setExpandedId(null)}>&times;</button>
                    {(() => {
                      const b = bookings.find(x => x._id === expandedId);
                      const sd = formatDate(b.dates[0]), ed = formatDate(b.dates.at(-1));
                      return (
                        <>
                          <h3>Booking Details</h3>
                          <p><strong>ID:</strong> {b._id}</p>
                          <p><strong>Hotel:</strong> {b.hotelId?.name}</p>
                          <p><strong>User:</strong> {b.userId?.username}</p>
                          <p><strong>Dates:</strong> {sd} – {ed}</p>
                          <p><strong>Rooms:</strong> {b.roomDetails?.map((r, i) => `#${r.number} (${r.title})`).join(", ")}</p>
                          <p><strong>Total:</strong> Rs. {b.totalPrice.toLocaleString()}</p>
                          <p><strong>Status:</strong> {statusBadge(b.status)}</p>
                          {b.cancellationRequestedAt && (
                            <p><strong>Cancellation Requested:</strong> {formatDate(b.cancellationRequestedAt)}</p>
                          )}
                          {b.status === "cancel_requested" && (
                            <div className="modal-actions">
                              <button
                                disabled={actionLoading}
                                onClick={() => updateStatus(b._id, "approve-cancel")}
                              >
                                Approve Cancellation
                              </button>
                              <button
                                disabled={actionLoading}
                                onClick={() => updateStatus(b._id, "reject-cancel")}
                              >
                                Reject Cancellation
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;