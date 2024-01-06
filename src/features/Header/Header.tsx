import React, { useState } from 'react';
import styles from './Header.module.css';

export function Header() {

  return (
    <div className={styles.container}>
      <div className={styles.empty}></div>
      <ul className={styles.tabs}>
        <li className={styles.tab}><p>Маршруты</p></li>
        <li className={styles.tab}><p>Остановки</p></li>
      </ul>
    </div>
  );
}
