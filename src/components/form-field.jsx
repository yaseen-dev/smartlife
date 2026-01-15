"use client";

import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FormField({ 
  type = "input", 
  name, 
  label, 
  required, 
  options = [], 
  ...props 
}) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  const renderField = (field) => {
    switch (type) {
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
            {label && (
              <label 
                htmlFor={name} 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {label}
              </label>
            )}
          </div>
        );
      case "textarea":
        return <Textarea {...field} value={field.value ?? ""} {...props} />;
      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value} disabled={props.disabled}>
            <SelectTrigger className={cn(error && "border-destructive")}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input {...field} value={field.value ?? ""} {...props} className={cn(error && "border-destructive", props.className)} />;
    }
  };

  return (
    <div className="space-y-2">
      {label && type !== "checkbox" && (
        <Label htmlFor={name} className="flex gap-1 text-sm font-semibold">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderField(field)}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
