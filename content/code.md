---
title: "Code"
description: "Coding projects by Psira (Sira Pornsiriprasert)"
layout: "code"
params:
  projects:
    enable: true
    # title: "Custom Name"
    items:
      - title: Ellip
        status: active
        content: A pure-Rust implementation of elliptic integrals. Applications of the elliptic integrals include computing the lengths of plane curves, magnetism, astrophysics, and string theory.
        image: /images/code/ellip-logo.svg
        featured:
          name: Docs
          link: https://docs.rs/ellip/latest/ellip/
        badges:
          - "Mathematics"
          - "Elliptic Integrals"
          - "Rust"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/ellip
          - icon: fab fa-rust
            url: https://crates.io/crates/ellip

      - title: Magba
        status: active
        content: Magba is a performant analytical magnetic computation library for Rust.
        image: /images/code/magba-logo.svg
        featured:
          name: Docs
          link: https://docs.rs/magba/
        badges:
          - "Magnetism"
          - "Simulation"
          - "Analytical"
          - "Physics"
          - "Rust"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/magba/
          - icon: fab fa-rust
            url: https://crates.io/crates/magba/

      - title: PyMagba
        status: active
        content: PyMagba is a performant Python library for analytical magnetic computation powered by Rust. It is still in the infancy stage but all the calculations should be correct. Stay tuned for PyMagba 0.2.0!
        image: /images/code/pymagba-logo-fit.svg
        # featured:
        #   name: Docs
        #   link: https://p-sira.github.io/pymagba/
        badges:
          - "Magnetism"
          - "Simulation"
          - "Analytical"
          - "Physics"
          - "Python"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/pymagba/
          - icon: fab fa-python
            url: https://pypi.org/project/pymagba/

      - title: DeepLabCut2Yolo
        status: maintained
        content: Deeplabcut2yolo automatically converts DeepLabCut (DLC) labels to the YOLO format, while providing customizability for more advanced users, so you can spend your energy on what matters!
        image: /images/code/d2y.jpg
        featured:
          name: Docs
          link: https://p-sira.github.io/deeplabcut2yolo/
        badges:
          - "AI"
          - "DeepLabCut"
          - "YOLO"
          - "Pose Estimation"
          - "Python"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/deeplabcut2yolo/
          - icon: fab fa-python
            url: https://pypi.org/project/deeplabcut2yolo/

      - title: Hycrypt
        status: maintained
        content: Hycrypt is a stateless-overwrite hybrid cryptosystem for secure communication and storage systems where only the recipient can decrypt the data — yet the data can be updated without the password.
        image: /images/code/hycrypt.jpg
        featured:
          name: Docs
          link: https://p-sira.github.io/hycrypt/
        badges:
          - "Cryptography"
          - "Hybrid Cryptosystem"
          - "Python"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/hycrypt/
          - icon: fab fa-python
            url: https://pypi.org/project/hycrypt/

      - title: LINE for Linux
        status: maintained
        content: LINE is widely used communication application. However, it is not officially supported on Linux. This project provides installation instructions and troubleshooting guides, enabling near-native experience on Linux. 
        image: /images/code/winehq_logo_glass.png
        featured:
          name: AppDB
          link: https://appdb.winehq.org/objectManager.php?sClass=version&iId=42184
        badges:
          - "Wine"
          - "Emulation"
          - "Linux"
        links:
          - icon: fas fa-wine-glass
            url: https://appdb.winehq.org/objectManager.php?sClass=application&iId=13986
          - icon: fab fa-line
            url: https://line.me/

      - title: num-lazy
        status: maintained
        content: num-lazy helps you write numbers for generic-typed functions, reduce typing, and improve readability!
        image: /images/code/num-lazy.jpg
        featured:
          name: Docs
          link: https://docs.rs/num-lazy/
        badges:
          - "Numerics"
          - "Macro"
          - "Rust"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/num-lazy/
          - icon: fab fa-rust
            url: https://crates.io/crates/num-lazy/

      - title: psira.me
        status: active
        content: 
          My personal website as you see here. Custom built with Hugo for rapid development. Featuring modified hugo-profile theme and modified Catppuccin color palette for light and dark mode. Supports responsive experience on both mobile and desktop.
        image: /images/code/psira-me.jpg
        badges:
          - "Portfolio"
          - "HTML/CSS"
          - "JS"
          - "Hugo"
        links:
          - icon: fab fa-github
            url: https://github.com/p-sira/psira-me/
---