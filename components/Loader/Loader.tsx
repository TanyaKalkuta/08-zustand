import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.overlay}>
      <p className={css.text}>Loading, please wait...</p>;
    </div>
  );
}
