export default function Spinner({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    //only the circle should spin like a loader not the whole svg using tailwind css and it should be text 
    <div className={`${className} animate-spin rounded-full h-8 w-8 border-b-2 border-white`}></div>
  );
}