export default function Footer() {
  return (
    <footer className="mt-8 pb-6 flex justify-center gap-6 text-xs text-slate-400">
      <a href="/privacy" className="hover:text-[#7C3AED] transition-colors">Privacy Policy</a>
      <a href="/terms" className="hover:text-[#7C3AED] transition-colors">Terms of Service</a>
      <a href="mailto:hello@prepstep.co.uk" className="hover:text-[#7C3AED] transition-colors">Contact</a>
    </footer>
  );
}
