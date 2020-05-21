import React, { useState } from "react";
import "./Extras.scss";
import { Bell, MapPin } from "react-feather";
import { Modal } from "./core/Modal";
import { appStore } from "../stores/AppStore";

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
                    <p>
                        <button
                            className={"btn"}
                            onClick={(event) => {
                                appStore.enablePositioning();
                            }}>
                            Use my Position
                        </button>{" "}
                        {appStore.enableUserPositioning}
                    </p>
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
                    <fieldset>
                        <legend>Reports to track</legend>
                        <table>
                            <thead>
                                <tr>
                                    <th>Report</th>
                                    <th>Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sweden</td>
                                    <td>Daily</td>
                                    <td>
                                        <a href={"#edit"}>Edit</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sweden</td>
                                    <td>Daily</td>
                                    <td>
                                        <a href={"#edit"}>Edit</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sweden</td>
                                    <td>Daily</td>
                                    <td>
                                        <a href={"#edit"}>Edit</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    {appStore.supportsNotifications && (
                        <fieldset>
                            <legend>Browser Notifications</legend>
                            {appStore.enableUserNotifications && (
                                <div>You have already enabled browser notifications</div>
                            )}
                            {!appStore.enableUserNotifications && (
                                <p>
                                    <button
                                        className={"btn"}
                                        onClick={(event) => {
                                            appStore.enableNotifications();
                                        }}>
                                        Allow Notifications
                                    </button>
                                </p>
                            )}
                        </fieldset>
                    )}
                    <fieldset>
                        <legend>E-mail Notifications</legend>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusamus autem dolore ex
                            explicabo fugit illum ipsum iure laborum magnam, modi nulla quidem quos sequi sit velit vero
                            voluptas voluptate?
                        </p>
                        <input type={"email"} placeholder={"Your e-mail address"} />
                    </fieldset>
                    <p>.... Work in Progress ...</p>
                </Modal>
            )}
        </div>
    );
};
