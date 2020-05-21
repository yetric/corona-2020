import React, { useState } from "react";
import "./Extras.scss";
import { Bell, MapPin } from "react-feather";
import { Modal } from "./core/Modal";

export const Extras = () => {
    const [showPosition, setShowPosition] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    return (
        <div className="extras">
            <div className="btn-group">
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        setShowPosition(true);
                    }}
                    className="btn">
                    <MapPin size={15} />
                    Use Position
                </button>
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        setShowNotifications(true);
                    }}
                    className="btn">
                    <Bell size={15} /> Notifications
                </button>
            </div>
            {showPosition && (
                <Modal
                    header={"Use Your Position"}
                    onClose={() => {
                        setShowPosition(false);
                    }}
                    allowClose={true}
                    footer={
                        <a
                            href={"#close"}
                            onClick={(event) => {
                                event.preventDefault();
                                setShowPosition(false);
                            }}>
                            Close
                        </a>
                    }>
                    We can use your position to show reports that are closer to you and set the country you are in as
                    your standard report.
                    <p>.... Work in Progress ...</p>
                </Modal>
            )}

            {showNotifications && (
                <Modal
                    header={"Subscribe to Notifications"}
                    onClose={() => {
                        setShowNotifications(false);
                    }}
                    allowClose={true}
                    footer={
                        <a
                            href={"#close"}
                            onClick={(event) => {
                                event.preventDefault();
                                setShowNotifications(false);
                            }}>
                            Close
                        </a>
                    }>
                    If you want to have digested emails or notifications in the browser, you can subscribe to your
                    preferred reports.
                    <p>.... Work in Progress ...</p>
                </Modal>
            )}
        </div>
    );
};
