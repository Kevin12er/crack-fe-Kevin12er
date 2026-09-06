import Greetings from '@/app/dashboard/greeting';
import StatCards from '@/app/dashboard/siswa/components/statcards';
import ContinueCard from '@/app/dashboard/siswa/components/continuecard';
import ProgressCard from '@/app/dashboard/siswa/components/progresscard';

export default function SiswaDashboard() {
  return (
    <div>
        <Greetings />
        <StatCards />
        <ContinueCard />
        <ProgressCard />
    </div>
  )
}