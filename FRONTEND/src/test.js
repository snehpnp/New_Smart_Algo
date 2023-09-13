import { useState, useEffect } from 'react';
import { GetAliceTokenAndID, CreateSocketSession, ConnctSocket } from "./Service/Alice_Socket"
import $ from 'jquery';
var CryptoJS = require("crypto-js");
var axios = require('axios');



const AliceBlueSocket_copy = () => {




  var BASEURL = 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/'
  var userId = "544383"
  var userSession = "u7IzOr6z09XVZ9ZR6LM203BrRVKgqqHj1DVtgLi2XnydNYg33KixKxRsp8esN5mUbo7FHWyRTVStDvT2EjhKSPJV6U5KztMzzGbx9BI8ifFa7SEWGZJIIIMTSFLb2PEyIShEz4AfXhe4Uic9IA6NHrANfkFOvcML1zuQtQ8QPishQoJ3oKBnLSuZ0NG4YlbizMNxb9eZpXXmmBO320IQ9GXJ2z2HdRK3jv4k72gPiEzHbYs0oNVLoWTbsNnF7tMG"


  let AuthorizationToken;
  let type = 'API'




  function checkMethod() {

    var userId = "544383";
    var userSession = "u7IzOr6z09XVZ9ZR6LM203BrRVKgqqHj1DVtgLi2XnydNYg33KixKxRsp8esN5mUbo7FHWyRTVStDvT2EjhKSPJV6U5KztMzzGbx9BI8ifFa7SEWGZJIIIMTSFLb2PEyIShEz4AfXhe4Uic9IA6NHrANfkFOvcML1zuQtQ8QPishQoJ3oKBnLSuZ0NG4YlbizMNxb9eZpXXmmBO320IQ9GXJ2z2HdRK3jv4k72gPiEzHbYs0oNVLoWTbsNnF7tMG";
    if (userSession && userId) {
      console.log(userId, userSession, 'userId userId')
      AuthorizationToken = 'Bearer ' + userId + ' ' + userSession
      invalidateSession()
    }
  }



  function invalidateSession() {
    let jsonObj = {
      loginType: type
    }
    $.ajax({

      url: BASEURL + 'api/ws/invalidateSocketSess',
      headers: {
        Authorization: AuthorizationToken
      },
      type: 'post',
      data: JSON.stringify(jsonObj),
      contentType: 'application/json',
      dataType: 'json',
      async: false,
      success: function (msg) {
        var data = JSON.stringify(msg)
        if (msg.stat === 'Ok') {
          createSession()
        }
      }
    });

  }

  function createSession() {
    let jsonObj = {
      loginType: type
    }
    $.ajax({

      url: BASEURL + 'api/ws/createSocketSess',
      headers: {
        Authorization: AuthorizationToken
      },
      type: 'post',
      data: JSON.stringify(jsonObj),
      contentType: 'application/json',
      dataType: 'json',
      async: false,
      success: function (msg) {
        var data = JSON.stringify(msg)
        if (msg.stat === 'Ok') {
          connect()
        } else {
          alert(msg)
        }
      }
    });
  }

  const url = "wss://ws1.aliceblueonline.com/NorenWS/"
  let socket;

  function connect() {

    socket = new WebSocket(url)

    socket.onopen = function () {
      connectionRequest()
    }
    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data)
      console.log('response', response);
      if (response.s === 'OK') {
        var channel = 'NFO|35048#NFO|35014';
        let json = {
          k: channel,
          t: 't'
        };
        socket.send(JSON.stringify(json))
      }
    }
  }

  function connectionRequest(requestId) {
    var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
    var initCon = {
      susertoken: encrcptToken,
      t: "c",
      actid: userId + "_" + type,
      uid: userId + "_" + type,
      source: type
    }
    console.log('connectionRequest', initCon);
    socket.send(JSON.stringify(initCon))
  }







  const MySOcket = async () => {

    var userId = "544383"
    var userSession = "u7IzOr6z09XVZ9ZR6LM203BrRVKgqqHj1DVtgLi2XnydNYg33KixKxRsp8esN5mUbo7FHWyRTVStDvT2EjhKSPJV6U5KztMzzGbx9BI8ifFa7SEWGZJIIIMTSFLb2PEyIShEz4AfXhe4Uic9IA6NHrANfkFOvcML1zuQtQ8QPishQoJ3oKBnLSuZ0NG4YlbizMNxb9eZpXXmmBO320IQ9GXJ2z2HdRK3jv4k72gPiEzHbYs0oNVLoWTbsNnF7tMG"
    let type = { loginType: "API" }


    let channelList = "NFO|35048#NFO|35014"

    const res = await CreateSocketSession(userId, userSession, type, )
    if (res.data.stat) {
      const handleResponse = (response) => {
        console.log('Received response:', response);
      };

      await ConnctSocket(userId, userSession, handleResponse , channelList);

    }

  }









  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Shakir</p>

        <button onClick={() => checkMethod()}> Run </button>


        <button onClick={() => MySOcket()}> MY Socket </button>



      </header>
    </div>
  );


}
export default AliceBlueSocket_copy









// import React , {useEffect} from 'react'
// import { Widget, addResponseMessage } from 'react-chat-widget';

// import 'react-chat-widget/lib/styles.css';





// const Testing = () => {

//   const handleNewUserMessage = (newMessage) => {
//     console.log(`New message incoming! ${newMessage}`);
//     // Now send the message throught the backend API
//   };



//   useEffect(() => {
//     addResponseMessage('Welcome to this awesome chat!');
//   }, []);



//   return (
//     <div>   <Widget handleNewUserMessage={handleNewUserMessage}
//       title="My new awesome title"
//       subtitle="And my cool subtitle"


//     /></div>
//   )
// }

// export default Testing