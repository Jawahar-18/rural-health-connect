package com.swasthyasetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medicines", indexes = {
        @Index(name = "idx_med_name", columnList = "name"),
        @Index(name = "idx_med_generic", columnList = "genericName")
})
public class Medicine {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 150)
    private String genericName;

    @Column(length = 50)
    private String form; // Tablet, Syrup, Injection, Ointment, Capsule

    @Column(length = 50)
    private String strength; // 500mg, 5mg, 100ml

    @Column(length = 50)
    private String category = "Essential Drugs";

    private boolean active = true;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }

    public String getForm() { return form; }
    public void setForm(String form) { this.form = form; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
