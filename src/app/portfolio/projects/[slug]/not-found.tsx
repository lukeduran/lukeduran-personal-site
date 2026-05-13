import Container from '@/components/Container';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <Container>
      <div className="py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Project Not Found
        </h1>
        <p className="mb-8 text-foreground/70">
          The project you're looking for doesn't exist.
        </p>
        <Button href="/portfolio" variant="secondary">
          Return Home
        </Button>
      </div>
    </Container>
  );
}
