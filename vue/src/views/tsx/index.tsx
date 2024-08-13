import { defineComponent, } from 'vue';
import useCounterStore from '@/store/counterStore';
import styles from '@/assets/styles/tsx/index.module.scss';

export default defineComponent({
  setup() {
    const store = useCounterStore();

    return () => (
      <p>
        <h2>{ store.count }</h2>
        <button
          class={styles.button}
          onClick={store.increment}>
          增加
        </button>
        <button
          class={styles.button}
          onClick={store.decrement}>
          减少
        </button>
        <button
          class={styles.button}
          onClick={store.reset}>
          重置
        </button>
      </p>
    );
  },
});

