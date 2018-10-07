// Initialize Firebase
// TODO: Replace with your project's customized code snippet
// var config = {
//     databaseURL: "https://calc-buff.firebaseio.com/"
// };
// firebase.initializeApp(config);

let db = firebase.database();

function dbRead(path, func) {
    // return db.ref(path).on('value', func);
    db.ref(path).on('value', func);
}

function dbWrite(path, val) {
    db.ref(path).set(val);
}

Vue.config.devtools = true;