import os

# Base directory (change if needed)
base_dir = "src/app"

# Project structure
structure = {
    "core/components/header": ["header.component.ts", "header.component.html", "header.component.scss"],
    "core/components/footer": ["footer.component.ts", "footer.component.html", "footer.component.scss"],
    "core/components/sidebar": ["sidebar.component.ts", "sidebar.component.html", "sidebar.component.scss"],

    "core/services": [
        "auth.service.ts", "user.service.ts", "resource.service.ts",
        "category.service.ts", "local-storage.service.ts", "notification.service.ts"
    ],

    "core/guards": ["auth.guard.ts"],
    "core/interceptors": ["token.interceptor.ts"],

    "core/models": [
        "user.model.ts", "resource.model.ts",
        "category.model.ts", "message.model.ts"
    ],

    "features/home": ["home.component.ts", "home.component.html", "home.component.scss"],

    "features/resources/resource-list": [
        "resource-list.component.ts", "resource-list.component.html", "resource-list.component.scss"
    ],
    "features/resources/resource-detail": [
        "resource-detail.component.ts", "resource-detail.component.html", "resource-detail.component.scss"
    ],
    "features/resources/resource-form": [
        "resource-form.component.ts", "resource-form.component.html", "resource-form.component.scss"
    ],

    "features/auth/login": [
        "login.component.ts", "login.component.html", "login.component.scss"
    ],
    "features/auth/register": [
        "register.component.ts", "register.component.html", "register.component.scss"
    ],

    "features/profile": [
        "profile.component.ts", "profile.component.html", "profile.component.scss"
    ],

    "features/chat": [
        "chat.component.ts", "chat.component.html", "chat.component.scss"
    ],

    "features/about": [
        "about.component.ts", "about.component.html", "about.component.scss"
    ],

    "shared/components/card-resource": [
        "card-resource.component.ts", "card-resource.component.html", "card-resource.component.scss"
    ],
    "shared/components/modal": [
        "modal.component.ts", "modal.component.html", "modal.component.scss"
    ],

    "shared/pipes": ["truncate.pipe.ts", "filter.pipe.ts"],
}

# Root app files
root_files = ["app.component.ts", "app.component.html", "app.component.scss", "app.routes.ts", "app.module.ts"]

def create_structure(base, structure_dict):
    for path, files in structure_dict.items():
        folder_path = os.path.join(base, path)
        os.makedirs(folder_path, exist_ok=True)
        print(f"[+] Created folder: {folder_path}")
        for file in files:
            file_path = os.path.join(folder_path, file)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write("")  # Empty file
            print(f"    -> Created file: {file_path}")

def create_root_files(base, files):
    for file in files:
        file_path = os.path.join(base, file)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("")
        print(f"[+] Created root file: {file_path}")

if __name__ == "__main__":
    print("Creating Angular app structure for DonLocal...")
    os.makedirs(base_dir, exist_ok=True)
    create_structure(base_dir, structure)
    create_root_files(base_dir, root_files)
    print("\nStructure created successfully!")
