import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    });
  }, []);

  const links = [
    { label: "AGENDA", path: "/agenda" },
    { label: "SESIONES", path: "/sesiones" },
    { label: "PONENTES", path: "/ponentes" },
    { label: "PATROCINADORES", path: "/patrocinadores" },
    { label: "CONFIGURACIÓN", path: "/configuracion" },
  ];

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {links.map(({ label, path }) => (
        <Typography
          key={path}
          as="li"
          variant="small"
          color="blue-gray"
          className={`p-1 font-normal ${
            location.pathname === path
              ? "text-blue-800 font-semibold"
              : "text-gray-700 hover:text-blue-800"
          }`}
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Link to={path} className="flex items-center">
            {label}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <Navbar
      className="sticky top-0 z-10 w-full max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 text-gray-700 bg-sky-300"
      placeholder={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="flex items-center justify-between">
        <Link
          to="/" 
          className="mr-4 py-1.5 font-medium text-blue-900"
        >
          INICIO
        </Link>

        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block nav-desktop">{navList}</div>
          <div className="hidden lg:flex items-center gap-x-1 nav-actions">
            <Link to="/registro">
              <Button 
                className="normal-case bg-blue-800 text-white hover:bg-blue-900 cursor-pointer" 
                size="sm"
                placeholder={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}>
                REGISTRARSE
              </Button>
            </Link>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {openNav ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}
