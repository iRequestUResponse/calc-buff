// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    databaseURL: "https://calc-buff.firebaseio.com/"
};
firebase.initializeApp(config);

let db = firebase.database();

function dbRead(path) {
    return db.ref(path).once('value');
}

function dbWrite(path, val) {
    db.ref(path).set(val);
}

Vue.config.devtools = true;