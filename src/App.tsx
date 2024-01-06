import React from 'react';
import styles from './App.module.css';
import { Map } from './features/Map/Map';
import { Header } from './features/Header/Header';

function App() {
  return (
    <div id='root' className={styles.root}>
      <div className={styles.toolbar}>
        <header className={styles.header}>
          <Header />
        </header>
        <div className={styles.tools}>
          <div className={styles.tools_buttons}></div>
          <nav className={styles.list_container}></nav>
        </div>
      </div>
      <div className={styles.map}>
        <Map />
      </div>
    </div>
  );
}

export default App;
