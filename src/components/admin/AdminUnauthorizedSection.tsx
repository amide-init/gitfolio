export function AdminUnauthorizedSection() {
  return (
    <section className="rounded-lg border border-rose-900/60 bg-rose-950/40 p-6">
      <h2 className="text-sm font-semibold text-rose-200">Unauthorized</h2>
      <p className="mt-2 text-sm text-rose-200/80">
        You are logged into GitHub, but your account does not have{' '}
        <span className="font-semibold">admin permission</span> on this
        repository. Only admins can edit the portfolio configuration.
      </p>
    </section>
  )
}
