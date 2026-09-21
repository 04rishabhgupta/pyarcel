import HeartLoader from "@/components/ui/HeartLoader";

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '60vh',
      width: '100%'
    }}>
      <HeartLoader size={80} />
    </div>
  );
}
