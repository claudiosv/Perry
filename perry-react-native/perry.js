import axios from "axios";
import { ListItem } from "react-native-elements";
import React from "react";

const api = axios.create({
  baseURL: "http://192.168.86.241:8080/",
  headers: {
    Token: "jnjrineifnajen"
  }
});

const getDevicePath = deviceName => {
  return api
    .get(`device/${deviceName}/path`)
    .then(res =>
      res.data.map(path => {
        return {
          name: path.date_added,
          coords: [path.latitude, path.longitude],
          children: path.device_id
        };
      })
    )
    .catch(error => console.error(error));
};

const getDeviceList = pathFunction => {
  return api
    .get("devices")
    .then(res =>
      res.data.map(device => {
        return {
          name: device.topic
        };
      })
    )
    .catch(error => console.error(error));
};

export default {
  getDeviceList,
  getDevicePath
};
