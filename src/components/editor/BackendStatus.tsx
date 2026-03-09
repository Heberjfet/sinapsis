import { useBackend } from '@/hooks/useBackend';

export const BackendStatus = () => {
  const { connected, checking } = useBackend();

  if (checking) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-2 h-2 rounded-full ${
          connected ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-muted-foreground">
        {connected ? 'API Online' : 'Modo Local'}
      </span>
    </div>
  );
};
