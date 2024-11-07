import TerminalList from "@/components/TerminalList";
import classes from '@/components/page.module.scss'

export default function Home() {
  return (
    <div>
      <main className={classes.main}>
        <h1>Терминалы</h1>
        <TerminalList />
      </main>
      <footer>
        
      </footer>
    </div>
  );
}
