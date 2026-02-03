"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Settings, User, Mail } from "lucide-react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { app } from "@/firebase";
import { useAuth } from "../auth/auth-context";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WahaWebsocket } from "@/lib/waha-websocket";

export function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    document.cookie =
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;";
    WahaWebsocket.destroyInstance();
    await signOut(getAuth(app));
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const auth = getAuth(app);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName || "User",
          photoURL: photoURL || null,
        });
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = (user?.displayName || user?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-gradient-to-r from-primary to-primary/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="w-32 h-16  rounded-xl flex items-center">
          <Image
            src="/logo.png"
            alt="LeadIA Logo"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-all duration-200 cursor-pointer group">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                    <span className="text-xs font-bold text-primary-foreground">
                      {userInitials}
                    </span>
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-bold leading-none text-background">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-white mt-0.5">{user?.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-foreground">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Editar Perfil</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>Atualizar nome.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Insira seu nome"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-accent/50"
                      />
                    </div>
                    {photoURL && (
                      <div className="flex justify-center">
                        <img
                          src={photoURL}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="ml-[2px] rounded-md border border-primary/40 bg-primary hover:bg-primary/90 px-3 py-1.5"
                    >
                      {isSaving ? "Salvando" : "Salvar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
