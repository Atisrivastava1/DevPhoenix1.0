"use client";
import React, {
  memo,
  ReactNode,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { Eye, EyeOff, Code, Database, Globe, Cloud, Cpu } from 'lucide-react';

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ==================== Input Component ====================

export const Input = memo(
  forwardRef(function Input(
    { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) {
    const radius = 100; // change this to increase the radius of the hover effect
    const [visible, setVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          #f97316,
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className='group/input rounded-lg p-[2px] transition duration-300'
      >
        <input
          type={type}
          className={cn(
            `flex h-10 w-full rounded-md border-none bg-slate-50 px-3 py-2 text-sm text-slate-900 transition duration-400 group-hover/input:shadow-none placeholder:text-slate-400 focus-visible:ring-[2px] focus-visible:ring-slate-300 focus-visible:outline-none shadow-sm`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  })
);

Input.displayName = 'Input';

// ==================== BoxReveal Component ====================

type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
};

export const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor,
  duration,
  overflow = 'hidden',
  position = 'relative',
  className,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    } else {
      slideControls.start('hidden');
      mainControls.start('hidden');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position as
          | 'relative'
          | 'absolute'
          | 'fixed'
          | 'sticky'
          | 'static',
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial='hidden'
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? '#f97316',
          borderRadius: 4,
        }}
      />
    </section>
  );
});

// ==================== Ripple Component ====================

type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

export const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = '',
}: RippleProps) {
  return (
    <section
      className={`absolute inset-0 flex items-center justify-center
        bg-orange-50/30
        [mask-image:linear-gradient(to_bottom,black,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';
        const borderOpacity = 5 + i * 5;

        return (
          <span
            key={i}
            className='absolute rounded-full border border-orange-500/20'
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: '1px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </section>
  );
});

// ==================== OrbitingCircles Component ====================

type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

export const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  const animId = `orbit-${radius}-${duration}`;
  return (
    <>
      {path && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          className='pointer-events-none absolute inset-0 size-full'
        >
          <circle
            stroke='rgba(100,116,139,0.15)'
            strokeWidth='1'
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
          />
        </svg>
      )}
      {/* Wrapper that rotates around center, then icon counter-rotates to stay upright */}
      <div
        className={cn('absolute inset-0 flex items-center justify-center pointer-events-none', className)}
      >
        <div
          className="absolute"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            animation: `spin-${animId} ${duration}s linear ${-delay}s infinite ${reverse ? 'reverse' : 'normal'}`,
          }}
        >
          {/* Icon sits at the top of the orbit ring, counter-rotates */}
          <div
            className="absolute w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 -translate-x-1/2"
            style={{
              top: 0,
              left: '50%',
              marginTop: '-24px',
              animation: `counter-spin-${animId} ${duration}s linear ${-delay}s infinite ${reverse ? 'normal' : 'reverse'}`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin-${animId} {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counter-spin-${animId} {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </>
  );
});

// ==================== TechOrbitDisplay Component ====================

type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactNode;
};

export const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = 'DEVPHOENIX\n#FollowTheRise',
}: { iconsArray: IconConfig[], text?: string }) {
  const lines = text.split('\n');
  return (
    <section className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <div className='pointer-events-none flex flex-col items-center gap-1 z-10'>
        {lines.map((line, i) => (
          <span
            key={i}
            className={`bg-gradient-to-b from-orange-400 to-red-600 bg-clip-text text-transparent text-center font-extrabold leading-tight ${
              i === 0 ? 'text-4xl md:text-6xl tracking-widest' : 'text-lg md:text-2xl tracking-[0.3em] font-bold opacity-80'
            }`}
          >
            {line}
          </span>
        ))}
      </div>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

// ==================== AnimatedForm Component ====================

type FieldType = 'text' | 'email' | 'password';

type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  fieldPerRow?: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type Errors = {
  [key: string]: string;
};

export const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  errorField,
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  goTo,
}: AnimatedFormProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setVisible(!visible);

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const currentErrors: Errors = {};
    fields.forEach((field) => {
      const value = (event.target as HTMLFormElement)[field.label]?.value;

      if (field.required && !value) {
        currentErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        currentErrors[field.label] = 'Invalid email address';
      }

      if (field.type === 'password' && value && value.length < 6) {
        currentErrors[field.label] =
          'Password must be at least 6 characters long';
      }
    });
    return currentErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(event);
      console.log('Form submitted');
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className='max-md:w-full flex flex-col gap-4 w-96 mx-auto'>
      <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
        <h2 className='font-extrabold text-4xl text-slate-900 tracking-tight'>
          {header}
        </h2>
      </BoxReveal>

      {subHeader && (
        <BoxReveal boxColor='var(--skeleton)' duration={0.3} className='pb-2'>
          <p className='text-slate-500 text-sm max-w-sm'>
            {subHeader}
          </p>
        </BoxReveal>
      )}

      {googleLogin && (
        <>
          <BoxReveal
            boxColor='var(--skeleton)'
            duration={0.3}
            overflow='visible'
            width='100%'
          >
            <button
              className='group/btn bg-white w-full rounded-lg border border-slate-200 h-11 font-semibold outline-hidden hover:cursor-pointer shadow-sm relative overflow-hidden transition-all hover:bg-slate-50'
              type='button'
              onClick={() => console.log('Google login clicked')}
            >
              <span className='flex items-center justify-center w-full h-full gap-3 text-slate-700 relative z-10'>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>

          <BoxReveal boxColor='var(--skeleton)' duration={0.3} width='100%'>
            <section className='flex items-center gap-4 my-2'>
              <hr className='flex-1 border-t border-slate-200' />
              <p className='text-slate-400 text-xs uppercase font-bold tracking-widest'>
                or
              </p>
              <hr className='flex-1 border-t border-slate-200' />
            </section>
          </BoxReveal>
        </>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <section
          className={`grid grid-cols-1 md:grid-cols-${fieldPerRow} mb-4`}
        >
          {fields.map((field) => (
            <section key={field.label} className='flex flex-col gap-2 mb-4 w-full'>
              <BoxReveal boxColor='var(--skeleton)' duration={0.3}>
                <Label htmlFor={field.label}>
                  {field.label} {field.required && <span className='text-orange-500'>*</span>}
                </Label>
              </BoxReveal>

              <BoxReveal
                width='100%'
                boxColor='var(--skeleton)'
                duration={0.3}
                className='flex flex-col space-y-2 w-full'
              >
                <section className='relative w-full'>
                  <Input
                    type={
                      field.type === 'password'
                        ? visible
                          ? 'text'
                          : 'password'
                        : field.type
                    }
                    id={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                    className="w-full border border-slate-200"
                  />

                  {field.type === 'password' && (
                    <button
                      type='button'
                      onClick={toggleVisibility}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-400'
                    >
                      {visible ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                    </button>
                  )}
                </section>

                <section className='h-4'>
                  {errors[field.label] && (
                    <p className='text-red-500 text-xs font-medium'>
                      {errors[field.label]}
                    </p>
                  )}
                </section>
              </BoxReveal>
            </section>
          ))}
        </section>

        <BoxReveal width='100%' boxColor='var(--skeleton)' duration={0.3}>
          {errorField && (
            <p className='text-red-500 text-sm mb-4'>{errorField}</p>
          )}
        </BoxReveal>

        <BoxReveal
          width='100%'
          boxColor='var(--skeleton)'
          duration={0.3}
          overflow='visible'
        >
          <button
            className='bg-orange-500 relative group/btn hover:bg-orange-600 block w-full text-white rounded-lg h-11 font-bold shadow-md outline-hidden hover:cursor-pointer transition-colors mt-2'
            type='submit'
          >
            <span className="relative z-10">{submitButton} &rarr;</span>
            <BottomGradient />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal boxColor='var(--skeleton)' duration={0.3} width="100%">
            <section className='mt-6 text-center hover:cursor-pointer'>
              <button
                className='text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors outline-hidden'
                onClick={goTo}
                type="button"
              >
                {textVariantButton}
              </button>
            </section>
          </BoxReveal>
        )}
      </form>
      <style>{`
        :root {
          --skeleton: #f1f5f9;
        }
      `}</style>
    </section>
  );
});

export const BottomGradient = () => {
  return (
    <>
      <span className='group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-orange-300 to-transparent z-0' />
      <span className='group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-red-500 to-transparent z-0' />
    </>
  );
};

// ==================== AuthTabs Component ====================

interface AuthTabsProps {
  formFields: {
    header: string;
    subHeader?: string;
    fields: Array<{
      label: string;
      required?: boolean;
      type: FieldType;
      placeholder: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }>;
    submitButton: string;
    textVariantButton?: string;
  };
  goTo: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const AuthTabs = memo(function AuthTabs({
  formFields,
  goTo,
  handleSubmit,
}: AuthTabsProps) {
  
  const techIcons = [
    { component: () => <svg viewBox="0 0 128 128" className="w-6 h-6"><path fill="#E34F26" d="M27.854 116.354l-8.043-90.211h88.378l-8.051 90.187-36.126 10.033z"/><path fill="#F16529" d="M64.012 117.781l28.69-7.971 6.549-73.308h-35.239z"/><path fill="#EBEBEB" d="M64.012 55.495h-14.773l-1.002-11.233h15.775v-10.963h-27.79l3.056 34.204h24.734zM64.012 79.516h-11.282l-.713-7.994h-10.957l1.528 17.172 21.424 5.94z"/><path fill="#FFF" d="M64.012 55.495v12.008h13.626l-1.288 14.444-12.338 3.327v11.455l21.401-5.932 2.112-23.701.196-2.181.854-9.529zM88.75 33.299h-24.738v10.963h23.754z"/></svg>, radius: 100, duration: 15, delay: 0 },
    { component: () => <svg viewBox="0 0 128 128" className="w-6 h-6"><path fill="#1572B6" d="M27.854 116.354l-8.043-90.211h88.378l-8.051 90.187-36.126 10.033z"/><path fill="#33A9DC" d="M64.012 117.781l28.69-7.971 6.549-73.308h-35.239z"/><path fill="#EBEBEB" d="M64.012 55.495h-15.006l-1.026-11.517h16.032v-11.258h-28.291l3.111 35.123h25.18zM64.012 79.516h-11.486l-.726-8.209h-11.155l1.555 17.633 21.812 6.04z"/><path fill="#FFF" d="M64.012 55.495v12.331h13.873l-1.311 14.832-12.562 3.417v11.763l21.787-6.038 2.15-24.339.2-2.24.87-9.787zM89.176 32.72h-25.164v11.258h24.162z"/></svg>, radius: 140, duration: 20, delay: 5, reverse: true },
    { component: () => <svg viewBox="0 0 128 128" className="w-6 h-6 rounded-sm"><path fill="#F7DF1E" d="M0 0h128v128H0z"/><path fill="#000" d="M85.457 91.565c-3.136-2.128-5.32-4.593-6.553-7.393l-10.473 6.664c2.52 4.48 6.16 8.232 10.92 11.257 4.76 3.024 10.416 4.536 16.968 4.536 6.832 0 12.32-1.624 16.464-4.873 4.144-3.248 6.216-7.56 6.216-12.937 0-4.032-1.12-7.336-3.36-9.912-2.24-2.576-5.712-4.928-10.416-7.056l-8.064-3.584c-3.136-1.456-5.376-2.912-6.72-4.368-1.344-1.456-2.016-3.192-2.016-5.208 0-2.352 1.008-4.256 3.024-5.712 2.016-1.456 4.592-2.184 7.728-2.184 3.36 0 6.16.896 8.4 2.688 2.24 1.792 4.088 4.144 5.544 7.056l10.865-6.385c-2.464-4.256-5.88-7.728-10.248-10.416-4.368-2.688-9.632-4.032-15.792-4.032-6.608 0-11.984 1.624-16.128 4.873-4.144 3.248-6.216 7.448-6.216 12.6 0 3.92 1.12 7.168 3.36 9.744 2.24 2.576 5.6 4.928 10.08 7.056l8.4 3.808c3.136 1.456 5.376 2.912 6.72 4.368 1.344 1.456 2.016 3.248 2.016 5.376 0 2.464-1.064 4.536-3.192 6.216-2.128 1.68-4.928 2.52-8.4 2.52-3.808-.001-7.001-1.065-9.353-3.193zm-48.497 4.144c-2.464 2.912-5.712 4.368-9.744 4.368-2.912 0-5.32-1.008-7.224-3.024-1.904-2.016-2.856-4.704-2.856-8.064V41h-12.77v49.169c0 6.608 1.904 11.984 5.712 16.128 3.808 4.144 8.792 6.216 14.952 6.216 5.712 0 10.528-1.568 14.448-4.704 3.92-3.136 6.832-7.168 8.736-12.096l-11.254-6.608z"/></svg>, radius: 180, duration: 25, delay: 10 },
    { component: () => <svg viewBox="0 0 128 128" className="w-6 h-6"><circle cx="64" cy="64" r="64" fill="#00D8FF"/><path d="M64 27.608c-20.932 0-38.675 5.503-49.919 13.91 3.593 1.934 7.625 3.655 11.944 5.105-1.517 2.164-2.316 4.394-2.316 6.634 0 5.485 5.503 10.457 15.549 14.11-2.939-2.73-4.63-5.736-4.63-8.887 0-6.19 8.238-11.455 21.054-13.435 2.164-5.328 4.954-10.133 8.318-14.437zm49.919 13.91c-11.244-8.407-28.987-13.91-49.919-13.91 3.364 4.304 6.154 9.109 8.318 14.437 12.816 1.98 21.054 7.245 21.054 13.435 0 3.151-1.691 6.157-4.63 8.887 10.046-3.653 15.549-8.625 15.549-14.11 0-2.24-.799-4.47-2.316-6.634 4.319-1.45 8.351-3.171 11.944-5.105zM36.194 65.655c-.092.833-.146 1.67-.146 2.505 0 13.957 12.518 25.275 27.952 25.275s27.952-11.318 27.952-25.275c0-.835-.054-1.672-.146-2.505-8.461 4.54-18.007 7.022-27.806 7.022s-19.345-2.482-27.806-7.022zm27.806-19.16c-3.116 0-5.642 2.526-5.642 5.642 0 3.116 2.526 5.642 5.642 5.642s5.642-2.526 5.642-5.642c0-3.116-2.526-5.642-5.642-5.642z" fill="#FFF"/><path d="M64 93.435c-15.434 0-27.952-11.318-27.952-25.275 0-.835.054-1.672.146-2.505C26.5 68.32 17.51 72.822 17.51 77.857c0 6.608 9.255 12.224 23.633 14.545-2.029 3.996-3.15 8.163-3.23 12.387 10.741-6.19 23.003-8.775 36.579-8.775s25.838 2.585 36.579 8.775c-.08-4.224-1.201-8.391-3.23-12.387 14.378-2.321 23.633-7.937 23.633-14.545 0-5.035-8.99-9.537-18.684-12.202.092.833.146 1.67.146 2.505 0 13.957-12.518 25.275-27.952 25.275z" fill="#FFF"/></svg>, radius: 220, duration: 30, delay: 15, reverse: true },
    { component: () => <svg viewBox="0 0 128 128" className="w-6 h-6"><path fill="#000" d="M64 128C28.65 128 0 99.35 0 64S28.65 0 64 0s64 28.65 64 64-28.65 64-64 64z"/><path fill="#FFF" d="M93.36 44.59L68.85 79.79l-13.88-16.14-16.94 16.14 26.6-38.35 15.35 17.56L96.34 44.59z"/></svg>, radius: 260, duration: 35, delay: 20 },
  ];

  return (
    <div className='flex w-full min-h-screen bg-white'>
      
      {/* Left Side: Cinematic Auth Graphic */}
      <div className='hidden lg:flex w-1/2 relative bg-slate-50 items-center justify-center overflow-hidden border-r border-slate-200'>
        <Ripple numCircles={6} mainCircleSize={200} mainCircleOpacity={0.15} />
        <div className="relative z-10 w-full h-[600px]">
           <TechOrbitDisplay iconsArray={techIcons} text={"DEVPHOENIX\n#FollowTheRise"} />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 relative'>
        {/* Subtle orange glow in background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-sm">
          <AnimatedForm
            {...formFields}
            fieldPerRow={1}
            onSubmit={handleSubmit}
            goTo={goTo}
            googleLogin='Continue with Google'
          />
        </div>
      </div>
    </div>
  );
});

// ==================== Label Component ====================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export const Label = memo(function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-bold text-slate-700 leading-none',
        className
      )}
      {...props}
    />
  );
});
