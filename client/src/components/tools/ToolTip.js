import styles from './ToolTip.module.css'

const ToolTip = ({children, text}) =>{
    return (
      <div className={styles.tooltip_container}>
        {children}
        <span className={styles.tooltip_text}>{text}</span>
      </div>
    );
}
export default ToolTip