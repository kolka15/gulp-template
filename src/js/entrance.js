function importAll (r) {
    r.keys().forEach(r);
}

importAll(require.context('./scripts/', true, /\.js$/));
importAll(require.context('./plugin-init/', true, /\.js$/));