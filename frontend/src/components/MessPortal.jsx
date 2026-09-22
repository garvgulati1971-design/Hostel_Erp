import React, { useState } from "react";
import { TODAY_MESS_MENU } from "../data/mockData";
import "./MessPortal.css";

export default function MessPortal() {
    const [activeTab, setActiveTab] = useState("Today");
    const [rating, setRating] = useState(5);
    const [dishFeedback, setDishFeedback] = useState("");
    const [submittedFeedback, setSubmittedFeedback] = useState(false);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setSubmittedFeedback(true);
        setTimeout(() => setSubmittedFeedback(false), 4000);
        setDishFeedback("");
    };

    return (
        <div className="mess-page fade-in">
            <div className="page-header">
                <div>
                    <h1>🍽️ SRM Executive Mess & Dining</h1>
                    <p>Daily menus, AI meal demand forecasts, and student dish feedback</p>
                </div>
                <div className="tab-pills">
                    <button
                        className={`btn ${activeTab === 'Today' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab("Today")}
                    >
                        Today's Menu
                    </button>
                    <button
                        className={`btn ${activeTab === 'Weekly' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab("Weekly")}
                    >
                        Weekly Calendar
                    </button>
                </div>
            </div>

            {/* AI Mess Demand Forecast Widget */}
            <div className="ai-mess-forecast">
                <div className="forecast-icon">🤖</div>
                <div className="forecast-content">
                    <h3>AI Mess Demand & Peak Crowd Forecast</h3>
                    <p>
                        Our AI model predicts peak mess queue times for <strong>{TODAY_MESS_MENU.day}</strong> between{" "}
                        <strong className="text-amber">01:10 PM - 01:45 PM</strong>. Recommended crowd-free dining window is <strong>12:20 PM - 12:50 PM</strong>.
                    </p>
                    <div className="forecast-tags">
                        <span className="badge badge-emerald">High Demand Item: Paneer Butter Masala</span>
                        <span className="badge badge-indigo">Predicted Waste Reduction: 92%</span>
                    </div>
                </div>
            </div>

            {activeTab === "Today" ? (
                <div className="menu-grid">
                    {/* Breakfast */}
                    <div className="meal-card">
                        <div className="meal-header">
                            <div>
                                <span className="meal-tag">MORNING</span>
                                <h2>🥞 Breakfast</h2>
                            </div>
                            <small className="meal-time">{TODAY_MESS_MENU.breakfast.time}</small>
                        </div>
                        <div className="meal-highlight">✨ {TODAY_MESS_MENU.breakfast.highlight}</div>
                        <ul className="dish-list">
                            {TODAY_MESS_MENU.breakfast.items.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                        <div className="meal-footer">
                            <span>🔥 Calories: {TODAY_MESS_MENU.breakfast.calories}</span>
                            <span className="badge badge-emerald">Served Hot</span>
                        </div>
                    </div>

                    {/* Lunch */}
                    <div className="meal-card featured">
                        <div className="meal-header">
                            <div>
                                <span className="meal-tag badge-emerald">CHEF SPECIAL</span>
                                <h2>🍛 Lunch</h2>
                            </div>
                            <small className="meal-time">{TODAY_MESS_MENU.lunch.time}</small>
                        </div>
                        <div className="meal-highlight">✨ {TODAY_MESS_MENU.lunch.highlight}</div>
                        <ul className="dish-list">
                            {TODAY_MESS_MENU.lunch.items.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                        <div className="meal-footer">
                            <span>🔥 Calories: {TODAY_MESS_MENU.lunch.calories}</span>
                            <span className="badge badge-emerald">Unlimited Buffet</span>
                        </div>
                    </div>

                    {/* Snacks */}
                    <div className="meal-card">
                        <div className="meal-header">
                            <div>
                                <span className="meal-tag">EVENING</span>
                                <h2>☕ High Tea & Snacks</h2>
                            </div>
                            <small className="meal-time">{TODAY_MESS_MENU.snacks.time}</small>
                        </div>
                        <div className="meal-highlight">✨ {TODAY_MESS_MENU.snacks.highlight}</div>
                        <ul className="dish-list">
                            {TODAY_MESS_MENU.snacks.items.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                        <div className="meal-footer">
                            <span>🔥 Calories: {TODAY_MESS_MENU.snacks.calories}</span>
                            <span className="badge badge-blue">Tea/Coffee Station</span>
                        </div>
                    </div>

                    {/* Dinner */}
                    <div className="meal-card">
                        <div className="meal-header">
                            <div>
                                <span className="meal-tag">NIGHT</span>
                                <h2>🌙 Dinner</h2>
                            </div>
                            <small className="meal-time">{TODAY_MESS_MENU.dinner.time}</small>
                        </div>
                        <div className="meal-highlight">✨ {TODAY_MESS_MENU.dinner.highlight}</div>
                        <ul className="dish-list">
                            {TODAY_MESS_MENU.dinner.items.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                        <div className="meal-footer">
                            <span>🔥 Calories: {TODAY_MESS_MENU.dinner.calories}</span>
                            <span className="badge badge-amber">Curfew Timings Apply</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="weekly-menu-card fade-in">
                    <h2>Weekly Executive Mess Schedule</h2>
                    <table className="weekly-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Breakfast</th>
                                <th>Lunch</th>
                                <th>Dinner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Monday</strong></td>
                                <td>Masala Dosa, Sambar, Chutney</td>
                                <td>Rajma Chawal, Veg Korma, Chapati</td>
                                <td>Egg Curry / Kadai Paneer, Rice</td>
                            </tr>
                            <tr>
                                <td><strong>Tuesday</strong></td>
                                <td>Idly, Vada, Kara Chutney</td>
                                <td>South Indian Meals, Poriyal, Rasam</td>
                                <td>Aloo Paratha, Curd, Dal Makhani</td>
                            </tr>
                            <tr>
                                <td><strong>Wednesday</strong></td>
                                <td>Puri Bhaji, Tea/Coffee</td>
                                <td>Veg Biryani, Mirchi Salan, Raita</td>
                                <td>Chicken Masala / Mushroom Masala, Roti</td>
                            </tr>
                            <tr>
                                <td><strong>Thursday</strong></td>
                                <td>Podi Idli, Medu Vada</td>
                                <td>Paneer Butter Masala, Jeera Rice</td>
                                <td>Lemon Rice, Phulka, Aloo Gobi</td>
                            </tr>
                            <tr>
                                <td><strong>Friday</strong></td>
                                <td>Pongal, Vada, Chutney</td>
                                <td>Fish Curry / Veg Pulao, Dal Fry</td>
                                <td>Gobi Manchurian, Veg Fried Rice</td>
                            </tr>
                            <tr>
                                <td><strong>Saturday</strong></td>
                                <td>Uttapam, Tomato Chutney</td>
                                <td>Chole Bhature, Sweet Lassi</td>
                                <td>Butter Naan, Paneer Tikka Masala</td>
                            </tr>
                            <tr>
                                <td><strong>Sunday Special</strong></td>
                                <td>Bread Omelette / Choco Muffins</td>
                                <td>Special Chicken Dum Biryani / Paneer Biryani</td>
                                <td>Ice Cream & Soft Parotta with Korma</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Food Rating Form */}
            <div className="feedback-section-card">
                <h2>Rate Today's Meal Quality & Taste</h2>
                <p>Mess Committee uses these ratings to optimize weekly chef menus.</p>

                {submittedFeedback && (
                    <div className="alert-success fade-in">
                        ✅ Thank you! Your feedback and star rating have been recorded by the Mess Committee.
                    </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="rating-form">
                    <div className="stars-selector">
                        <label>Meal Quality Rating:</label>
                        <div className="stars-row">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className={`star-btn ${rating >= star ? 'selected' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                            <span className="rating-num">({rating} / 5 Stars)</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Share suggestions for today's dish preparation or taste..."
                            value={dishFeedback}
                            onChange={(e) => setDishFeedback(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-emerald">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}
