import { Button } from "./Ui"

type NavbarProps = {
    userName :string,
    role:string,
    onLogOut : () => void,
    links?: { label :string; onClick : () => void}[]
}


export const NavBar = ({ userName ,role ,onLogOut,links} : NavbarProps) => {
    return <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
    <div className="flex items-center gap-6">
      <span className="font-bold text-slate-900 tracking-tight">RateStore</span>
      {links?.map(l => (
        <button  key={l.label} onClick={l.onClick} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{l.label}</button>
      ))}
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-slate-900">{userName}</p>
        <p className="text-xs text-slate-500 capitalize">{role}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onLogOut}>Logout</Button>
    </div>
  </nav>
}