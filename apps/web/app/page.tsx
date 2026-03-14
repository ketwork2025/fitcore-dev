import { redirect } from 'next/navigation';

export default function Home() {
  /**
   * [Planning - Beomsu] 
   * Redirecting to UI-Test lab for immediate product experience.
   * "Dashboard-First" acquisition strategy.
   */
  redirect('/ui-test');
}
